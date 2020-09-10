export default function Title() {
  return (
    <>
      <h1 className="Title">
        Welcome to <a href="https://nextjs.org">Next.js!</a>
      </h1>

      <style jsx>{`
        .Title a {
          color: #0070f3;
          text-decoration: none;
        }

        .Title a:hover,
        .Title a:focus,
        .Title a:active {
          text-decoration: underline;
        }

        .Title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
          text-align: center;
        }
      `}</style>
    </>
  )
}
