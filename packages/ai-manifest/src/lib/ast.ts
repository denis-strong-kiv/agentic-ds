/**
 * AST utilities — thin wrappers around ts-morph for parsing TSX source files.
 * Provides helpers for extracting props interfaces, CVA variant calls, JSDoc
 * annotations, and import statements.
 */

import {
  Project,
  SourceFile,
  InterfaceDeclaration,
  TypeAliasDeclaration,
  CallExpression,
  Node,
  SyntaxKind,
  PropertySignature,
  JSDoc,
} from 'ts-morph';
import type { PropDef, VariantAxis, PropType } from '../types.js';

// ─── Project factory ──────────────────────────────────────────────────────────

let _project: Project | null = null;

export function getProject(): Project {
  if (!_project) {
    _project = new Project({
      skipAddingFilesFromTsConfig: true,
      compilerOptions: {
        strict: true,
        jsx: 4, // react-jsx
      },
    });
  }
  return _project;
}

export function addSourceFile(filePath: string): SourceFile {
  const project = getProject();
  const existing = project.getSourceFile(filePath);
  if (existing) return existing;
  return project.addSourceFileAtPath(filePath);
}

// ─── Props extraction ─────────────────────────────────────────────────────────

/** Map TypeScript type text to simplified PropType */
function resolveType(typeText: string): { type: PropType; values?: string[] } {
  const t = typeText.trim();

  if (t === 'boolean') return { type: 'boolean' };
  if (t === 'number') return { type: 'number' };
  if (t === 'string') return { type: 'string' };
  if (t === 'React.ReactNode' || t === 'ReactNode') return { type: 'React.ReactNode' };
  if (t === 'React.CSSProperties' || t === 'CSSProperties') return { type: 'React.CSSProperties' };
  if (t.startsWith('React.Ref') || t.startsWith('Ref<')) return { type: 'ref' };
  if (t.includes('=>') || t.startsWith('(')) return { type: 'function' };
  if (t.startsWith('Array<') || t.endsWith('[]')) return { type: 'array' };

  // Union of string literals → enum
  const literals = t
    .split('|')
    .map(s => s.trim().replace(/^['"]|['"]$/g, ''))
    .filter(s => s.length > 0);

  const allLiterals = literals.every(s => !s.includes(' ') && s !== 'null' && s !== 'undefined');
  if (literals.length > 1 && allLiterals) {
    return { type: 'enum', values: literals.filter(s => s !== 'null' && s !== 'undefined') };
  }

  return { type: 'object' };
}

function getJSDocText(node: PropertySignature): string | undefined {
  const jsDocs = node.getJsDocs();
  return jsDocs.length > 0 ? jsDocs[0].getDescription().trim() : undefined;
}

function extractPropsFromInterface(iface: InterfaceDeclaration): PropDef[] {
  return iface.getProperties().map(prop => {
    const name = prop.getName();
    const optional = prop.hasQuestionToken();
    const typeText = prop.getTypeNode()?.getText() ?? 'unknown';
    const { type, values } = resolveType(typeText);
    const description = getJSDocText(prop);

    // Extract default from JSDoc @default tag
    const jsDocs = prop.getJsDocs();
    let defaultValue: string | undefined;
    for (const doc of jsDocs) {
      for (const tag of doc.getTags()) {
        if (tag.getTagName() === 'default') {
          defaultValue = tag.getCommentText()?.trim();
        }
      }
    }

    const entry: PropDef = {
      name,
      type,
      required: !optional,
    };
    if (values) entry.values = values;
    if (defaultValue) entry.default = defaultValue;
    if (description) entry.description = description;
    return entry;
  });
}

/** Extract props from the primary Props interface in a TSX file */
export function extractProps(sf: SourceFile, componentName: string): PropDef[] {
  // Try [ComponentName]Props first, then any interface ending in Props
  const candidates = [
    sf.getInterface(`${componentName}Props`),
    ...sf.getInterfaces().filter(i => i.getName().endsWith('Props')),
  ].filter((x): x is InterfaceDeclaration => x != null);

  if (candidates.length === 0) return [];
  return extractPropsFromInterface(candidates[0]);
}

// ─── CVA variant extraction ────────────────────────────────────────────────────

/** Find all `cva(...)` call expressions and extract variant axes */
export function extractCvaVariants(sf: SourceFile): VariantAxis[] {
  const axes: VariantAxis[] = [];

  sf.getDescendantsOfKind(SyntaxKind.CallExpression).forEach(call => {
    const expr = call.getExpression().getText();
    if (expr !== 'cva') return;

    const args = call.getArguments();
    if (args.length < 2) return;

    const configArg = args[1];
    if (!Node.isObjectLiteralExpression(configArg)) return;

    const variantsProp = configArg
      .getProperties()
      .find(p => Node.isPropertyAssignment(p) && p.getName() === 'variants');

    if (!variantsProp || !Node.isPropertyAssignment(variantsProp)) return;

    const variantsObj = variantsProp.getInitializer();
    if (!variantsObj || !Node.isObjectLiteralExpression(variantsObj)) return;

    for (const axisEntry of variantsObj.getProperties()) {
      if (!Node.isPropertyAssignment(axisEntry)) continue;
      const axisName = axisEntry.getName();
      const axisInit = axisEntry.getInitializer();
      if (!axisInit || !Node.isObjectLiteralExpression(axisInit)) continue;

      const values = axisInit
        .getProperties()
        .filter(p => Node.isPropertyAssignment(p) || Node.isMethodDeclaration(p))
        .map(p => (p as { getName(): string }).getName());

      // Look for defaultVariants in the same cva call
      const defaultsProp = configArg
        .getProperties()
        .find(p => Node.isPropertyAssignment(p) && p.getName() === 'defaultVariants');

      let defaultValue: string | undefined;
      if (defaultsProp && Node.isPropertyAssignment(defaultsProp)) {
        const defaultsObj = defaultsProp.getInitializer();
        if (defaultsObj && Node.isObjectLiteralExpression(defaultsObj)) {
          const axisDef = defaultsObj
            .getProperties()
            .find(p => Node.isPropertyAssignment(p) && (p as { getName(): string }).getName() === axisName);
          if (axisDef && Node.isPropertyAssignment(axisDef)) {
            defaultValue = axisDef.getInitializer()?.getText().replace(/^['"]|['"]$/g, '');
          }
        }
      }

      const axis: VariantAxis = { name: axisName, values };
      if (defaultValue) axis.default = defaultValue;
      axes.push(axis);
    }
  });

  return axes;
}

// ─── JSDoc annotation extraction ─────────────────────────────────────────────

export interface ComponentJSDoc {
  description?: string;
  patterns: string[];
  uses: string[];
}

/** Scan all JSDoc blocks in a file for @uiComponent, @pattern, @uses tags */
export function extractJSDocAnnotations(sf: SourceFile): ComponentJSDoc {
  const result: ComponentJSDoc = { patterns: [], uses: [] };

  const jsDocs: JSDoc[] = [];
  sf.getDescendants().forEach(node => {
    if (Node.isJSDoc(node)) jsDocs.push(node);
  });

  for (const doc of jsDocs) {
    for (const tag of doc.getTags()) {
      const tagName = tag.getTagName();
      const comment = tag.getCommentText()?.trim() ?? '';
      if (tagName === 'uiComponent' && !result.description) {
        result.description = comment || doc.getDescription().trim() || undefined;
      }
      if (tagName === 'pattern' && comment) result.patterns.push(comment);
      if (tagName === 'uses' && comment) result.uses.push(comment);
    }
    // Also capture standalone @uiComponent description from function/class JSDoc
    if (!result.description) {
      const desc = doc.getDescription().trim();
      if (desc) result.description = desc;
    }
  }

  return result;
}

// ─── Import analysis ──────────────────────────────────────────────────────────

export interface ImportInfo {
  specifier: string;
  names: string[];
  isExternal: boolean;
  isRelative: boolean;
}

export function extractImports(sf: SourceFile): ImportInfo[] {
  return sf.getImportDeclarations().map(imp => {
    const specifier = imp.getModuleSpecifierValue();
    const names = imp.getNamedImports().map(n => n.getName());
    const defaultImp = imp.getDefaultImport()?.getText();
    if (defaultImp) names.unshift(defaultImp);

    return {
      specifier,
      names,
      isExternal: !specifier.startsWith('.') && !specifier.startsWith('/'),
      isRelative: specifier.startsWith('.'),
    };
  });
}

// ─── CSS class extraction ─────────────────────────────────────────────────────

/** Extract all string literals used as className values in JSX */
export function extractCssClasses(sf: SourceFile): string[] {
  const classes = new Set<string>();

  // String literals in cn(...) calls or className= attributes
  sf.getDescendantsOfKind(SyntaxKind.StringLiteral).forEach(lit => {
    const text = lit.getLiteralValue();
    // Only collect BEM-style class names (contain a dash, no spaces)
    if (text.includes('-') && !text.includes(' ') && !text.startsWith('/') && !text.startsWith('.')) {
      classes.add(text);
    }
  });

  // Template literals in cn(...)
  sf.getDescendantsOfKind(SyntaxKind.NoSubstitutionTemplateLiteral).forEach(lit => {
    const text = lit.getLiteralValue();
    if (text.includes('-') && !text.includes(' ')) {
      classes.add(text);
    }
  });

  return Array.from(classes).sort();
}

// ─── Radix primitive detection ────────────────────────────────────────────────

/** Return the Radix primitive package imported, if any */
export function extractRadixPrimitive(sf: SourceFile): string | undefined {
  const radixImport = sf
    .getImportDeclarations()
    .find(imp => imp.getModuleSpecifierValue().startsWith('@radix-ui/react-'));

  return radixImport?.getModuleSpecifierValue();
}
