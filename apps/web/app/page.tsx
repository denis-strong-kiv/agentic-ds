import Image from "next/image";

export default function Home() {
  return (
    <div className="web-root-home">
      <main className="web-root-home-main">
        <Image
          className="web-root-home-logo"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="web-root-home-content">
          <h1 className="web-root-home-title">
            To get started, edit the page.tsx file.
          </h1>
          <p className="web-root-home-description">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="web-root-home-inline-link"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="web-root-home-inline-link"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div className="web-root-home-actions">
          <a
            className="web-root-home-cta web-root-home-cta--primary"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="web-root-home-cta-icon"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="web-root-home-cta web-root-home-cta--secondary"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
