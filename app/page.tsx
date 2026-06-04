import { Footer } from "@/components/footer";
import { Game } from "@/components/game";
import { Header } from "@/components/header";

export default function HomePage() {
  return (
    <main className="bg-app-gradient flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1 flex-col items-center px-4 pb-8 pt-0">
        <div className="h-full w-full max-w-3xl">
          <Game />
        </div>
      </div>
      <Footer />
    </main>
  );
}
