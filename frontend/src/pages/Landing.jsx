import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Bot, 
  Zap, 
  Shield, 
  Smartphone, 
  MessageSquare, 
  Cpu,
  ChevronRight,
  Star,
  Users,
  Command
} from 'lucide-react'
import Navbar from '../components/Navbar'

const features = [
  {
    icon: Bot,
    title: 'AI-Powered',
    description: 'Advanced DeepSeek AI integration for human-like responses and intelligent conversations.'
  },
  {
    icon: Command,
    title: '50+ Commands',
    description: 'Comprehensive command system including group management, media processing, and fun tools.'
  },
  {
    icon: Smartphone,
    title: 'Easy Setup',
    description: 'Simple pairing code connection. No QR scanning needed. Connect in seconds.'
  },
  {
    icon: Shield,
    title: 'Secure',
    description: 'End-to-end encryption, JWT authentication, and secure session management.'
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Optimized for low-resource environments like Termux. Runs smoothly anywhere.'
  },
  {
    icon: MessageSquare,
    title: 'Auto-Reply',
    description: 'Smart auto-reply system when you are unavailable. Never miss important messages.'
  }
]

const stats = [
  { label: 'Active Users', value: '1,000+', icon: Users },
  { label: 'Commands', value: '50+', icon: Command },
  { label: 'Uptime', value: '99.9%', icon: Zap },
  { label: 'Rating', value: '4.9/5', icon: Star }
]

const Landing = () => {
  return (
    <div className="min-h-screen bg-dark-950">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-900/20 to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="inline-flex items-center space-x-2 bg-primary-500/10 border border-primary-500/30 rounded-full px-4 py-2 mb-8"
            >
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-primary-400 text-sm font-medium">Powered by DeepSeek AI</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-primary-200 to-primary-400 bg-clip-text text-transparent">
              Wix WhatsApp<br />AI Bot
            </h1>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
              The ultimate AI-powered WhatsApp automation platform. 
              Built by Wisdom for seamless communication.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="btn-primary flex items-center space-x-2 text-lg">
                <span>Get Started</span>
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link to="/login" className="btn-secondary text-lg">
                Sign In
              </Link>
            </div>

            <div className="mt-8 text-sm text-gray-500">
              <Cpu className="w-4 h-4 inline mr-1" />
              Optimized for Termux & Low-Resource Environments
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="glass p-6 text-center"
              >
                <stat.icon className="w-8 h-8 text-primary-500 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Powerful Features</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Everything you need to automate and enhance your WhatsApp experience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="card"
              >
                <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Command Preview */}
      <section className="py-20 px-4 bg-dark-900/50">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="glass p-8 rounded-2xl"
          >
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Command Preview</h3>
            <div className="space-y-3 font-mono text-sm">
              <div className="flex items-center space-x-3 p-3 bg-dark-800 rounded-lg">
                <span className="text-primary-500 font-bold">.menu</span>
                <span className="text-gray-400">— Show all available commands</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-dark-800 rounded-lg">
                <span className="text-primary-500 font-bold">.ai</span>
                <span className="text-gray-400">— Chat with DeepSeek AI</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-dark-800 rounded-lg">
                <span className="text-primary-500 font-bold">.sticker</span>
                <span className="text-gray-400">— Create stickers from images</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-dark-800 rounded-lg">
                <span className="text-primary-500 font-bold">.tagall</span>
                <span className="text-gray-400">— Mention all group members</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-dark-800 rounded-lg">
                <span className="text-primary-500 font-bold">.autoreply on</span>
                <span className="text-gray-400">— Enable smart auto-replies</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          <p>© 2024 Wix WhatsApp AI Bot. Created by Wisdom.</p>
          <p className="mt-2">Built with ❤️ for Termux & low-resource environments</p>
        </div>
      </footer>
    </div>
  )
}

export default Landing
