export default function Card({ href, title, description }) {
  return (
    <>
      <a href={href} className="Card">
        <h3>{title}</h3>
        <p>{description}</p>
      </a>

      <style jsx>{`
        .Card {
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .Card:hover,
        .Card:focus,
        .Card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .Card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .Card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }
      `}</style>
    </>
  );
}
