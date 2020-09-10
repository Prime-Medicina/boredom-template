export default function Footer() {
  return (
    <>
      <footer className="Footer">
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer">
          Powered by <img src="/vercel.svg" alt="Vercel Logo" />
        </a>
      </footer>

      <style jsx>{`
        .Footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .Footer img {
          margin-left: 0.5rem;
          height: 1em;
        }

        .Footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </>
  )
}
