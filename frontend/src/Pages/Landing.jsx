import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { useNavigate } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import assistantImg from "../assets/image.png"; // bottom bot
import topBotImg from "../assets/image_copy_2-removebg-preview.png"; // top-right bot

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-950 text-white flex flex-col items-center justify-start pt-28 px-4 sm:px-6 lg:px-10 relative overflow-hidden">

      {/* 🔮 Background Blobs */}
      <div className="absolute w-[400px] h-[400px] bg-purple-700 rounded-full blur-3xl opacity-20 top-[-100px] left-[-100px] animate-pulse"></div>
      <div className="absolute w-[350px] h-[350px] bg-indigo-600 rounded-full blur-2xl opacity-20 bottom-[-120px] right-[-120px] animate-ping"></div>

      {/* 🤖 Top Bot Floating (Desktop only) */}
      <div className="absolute top-25 right-15 z-30 group flex-col items-end hidden sm:flex">
        <div className="relative bg-white text-black text-xs sm:text-sm rounded-xl shadow-lg px-3 py-2 mb-2 max-w-[180px] sm:max-w-xs scale-105 transition before:content-[''] before:absolute before:bottom-[-8px] before:right-4 before:border-8 before:border-t-white before:border-x-transparent before:border-b-0">
          <TypeAnimation
            sequence={[
              "Try voice features!",
              2000,
              "Say: remind me at 5pm",
              2000,
              "Add meeting to calendar 📅",
              2000,
              "Schedule Google Meet call 🎥",
              2000,
            ]}
            wrapper="span"
            speed={45}
            repeat={Infinity}
          />
        </div>

        <div className="w-28">
          <Tilt glareEnable={true} glareMaxOpacity={0.2} tiltMaxAngleX={10} tiltMaxAngleY={10}>
            <img
              src={topBotImg}
              alt="Top Bot"
              className="w-full rounded-xl drop-shadow-xl transition-transform hover:scale-105"
            />
          </Tilt>
        </div>
      </div>

      {/* 💬 Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10 max-w-2xl w-full px-2"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight ">
          <TypeAnimation
            sequence={[
              "Your Smart AI Task Assistant",
              1000,
              "Set Reminders Easily",
              1000,
              "Schedule Google Meet or Emails",
              1000,
              "Control Everything with Voice",
              1000,
            ]}
            wrapper="span"
            speed={50}
            repeat={Infinity}
          />
        </h1>

        <p className="text-base sm:text-lg text-gray-300 mb-6">
          Automate your life. One assistant for all your personal tasks — voice-controlled and smart.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/app")}
          className="bg-purple-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-purple-700 transition font-semibold"
        >
          🚀 Try It Now
        </motion.button>

        {/* 👇 Top Bot Inline (Mobile only, shown after CTA button) */}
        <div className="sm:hidden mt-6 flex flex-col items-center justify-center z-10">
          <div className="bg-white mr-25  text-black text-xs rounded-xl shadow px-3 py-2 max-w-[220px] text-center">
            <TypeAnimation
              sequence={[
                "Try voice features!",
                2000,
                "Say: remind me at 5pm",
                2000,
                "Add meeting to calendar 📅",
                2000,
                "Schedule Google Meet call 🎥",
                2000,
              ]}
              wrapper="span"
              speed={45}
              repeat={Infinity}
            />
          </div>
          <img
            src={topBotImg}
            alt="Bot Mobile"
            className="w-24 mt-3 drop-shadow-xl rounded-xl mb-2"
          />
        </div>
      </motion.div>

      {/* ⚙️ Features Section */}
      <div className="mt-16 mb-28 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl z-10 px-2">
        {[
          { icon: "⏰", title: "Reminders", desc: "Natural reminders — never miss a thing." },
          { icon: "📬", title: "Email Assistant", desc: "Send messages like 'Mail boss I'm late'" },
          { icon: "📅", title: "Google Calendar", desc: "Create events like 'Add meeting at 4pm'" },
          { icon: "🎥", title: "Google Meet", desc: "Say 'Schedule a Meet with Rahul'" },
          { icon: "📝", title: "To-Do List", desc: "Voice-based daily task tracking" },
          { icon: "🤖", title: "Smart Chat", desc: "Casual AI chat with fallback responses" },
        ].map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 * i }}
            className="bg-white/10 backdrop-blur-md shadow-md rounded-xl p-5 text-center hover:shadow-2xl transition border border-white/10"
          >
            <div className="text-4xl mb-2">{f.icon}</div>
            <h3 className="text-lg font-bold text-white">{f.title}</h3>
            <p className="text-sm text-gray-300">{f.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* 🤖 Bottom Bot */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end group">
        <div className="relative mb-2 max-w-xs p-3 bg-white text-black text-sm rounded-xl shadow-lg scale-0 group-hover:scale-100 transition-transform origin-bottom-right duration-300 ease-out before:content-[''] before:absolute before:bottom-[-8px] before:right-4 before:border-8 before:border-t-white before:border-x-transparent before:border-b-0">
          <TypeAnimation
            sequence={[
              "Hi there! 👋",
              2000,
              "Ask me to set a reminder ⏰",
              2000,
              "I can create Calendar events! 📅",
              2000,
              "Say: Schedule Meet with boss 🎥",
              2000,
              "Try me now 👇",
              2000,
            ]}
            wrapper="span"
            speed={45}
            repeat={Infinity}
          />
        </div>

        <Tilt tiltMaxAngleX={6} tiltMaxAngleY={6} glareEnable={true} glareMaxOpacity={0.25}>
          <img
            onClick={() => navigate("/app")}
            src={assistantImg}
            alt="Bot"
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-purple-500 shadow-xl cursor-pointer hover:scale-105 transition"
          />
        </Tilt>
      </div>

      {/* FAQ Section */}
      <div className="mt-20 w-full max-w-3xl z-10 px-4" data-aos="fade-up">
        <h2 className="text-2xl font-bold text-center text-white mb-6">❓ Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            {
              q: "How do I set a reminder?",
              a: "Just say something like 'Remind me to call mom at 6pm'. The assistant will take care of it."
            },
            {
              q: "Can I schedule Google Calendar events?",
              a: "Yes! You can say 'Add meeting with team at 4pm tomorrow', and it will be added to your calendar."
            },
            {
              q: "Can I create a Google Meet call?",
              a: "Definitely. Just say 'Schedule a Google Meet with Rahul at 5pm' and you’ll get a meeting link."
            },
            {
              q: "Is my data secure?",
              a: "Absolutely. We use end-to-end encryption for all messages, and store no sensitive data without your consent."
            },
            {
              q: "What voice commands are supported?",
              a: "Commands like reminders, Google Meet, calendar events, weather checks, emails, and even casual chat are supported."
            },
          ].map((item, idx) => (
            <details key={idx} className="bg-white/5 p-4 rounded-xl border border-white/10">
              <summary className="cursor-pointer font-semibold text-white mb-2">
                {item.q}
              </summary>
              <p className="text-sm text-gray-300 mt-2 pl-1">{item.a}</p>
            </details>
          ))}
        </div>
      </div>

      {/* 🧾 Footer */}
      <footer className="mt-16 mb-5 text-gray-400 text-xs z-10 text-center">
        Made with 💡 by Jeet Goyal © {new Date().getFullYear()}
      </footer>
    </div>
  );
}

export default Landing;
