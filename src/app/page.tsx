import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Video Background */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/ai.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-70 z-10" />

      {/* Content */}
      <div className="relative z-20 grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 text-white">
        <main className="flex flex-col gap-12 row-start-2 items-center text-center max-w-4xl">
          <div className="space-y-8">
          <div className="relative w-[200px] h-[200px] mx-auto filter drop-shadow-glow">
            <Image
              src="/logo.png"
              alt="Sirius Regenerative"
              width={200}
              height={200}
              className="mb-4"
              priority
            />
          </div>

            <div className="space-y-6 mt-8">
              <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                The AI Factory
              </h1>
              
              <div className="space-y-4">
                <h2 className="text-2xl font-light text-blue-100">
                  Coming Soon: The Future of AI Swarm Technology
                </h2>
                <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                  Imagine a production line that generates customized AI agents at scale. 
                  Each agent with its own identity, knowledge, and toolset, working together 
                  in a synchronized swarm.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="p-6 bg-black bg-opacity-50 rounded-lg backdrop-blur-sm border border-gray-800">
                  <h3 className="text-blue-400 font-semibold mb-2">Instant Deployment</h3>
                  <p className="text-gray-300 text-sm">Multiple tailored agents deployed daily for your specific needs</p>
                </div>
                <div className="p-6 bg-black bg-opacity-50 rounded-lg backdrop-blur-sm border border-gray-800">
                  <h3 className="text-blue-400 font-semibold mb-2">Universal Access</h3>
                  <p className="text-gray-300 text-sm">Seamless WhatsApp integration for familiar, accessible interaction</p>
                </div>
                <div className="p-6 bg-black bg-opacity-50 rounded-lg backdrop-blur-sm border border-gray-800">
                  <h3 className="text-blue-400 font-semibold mb-2">Swarm Intelligence</h3>
                  <p className="text-gray-300 text-sm">Collaborative AI network that evolves with your business</p>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <Link
                href="/chat"
                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-blue-600 text-white gap-2 hover:bg-blue-700 text-base h-12 px-8 mx-auto backdrop-blur-sm"
              >
                ALMA
              </Link>
            </div>
          </div>
        </main>

        <footer className="row-start-3 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Sirius Agentic. Building the future of AI swarms.</p>
        </footer>
      </div>
    </div>
  );
}