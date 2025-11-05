export function Footer() {
  return (
    <footer className="py-4">
      <p className="app-orientation">
        このアプリは
        <a
          href="https://pokeapi.co/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-400 hover:underline"
        >
          PokéAPI
        </a>
        を使用しています
      </p>
    </footer>
  );
}
