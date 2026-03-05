"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Zap, Shield, Activity, Bell, Eye, BarChart3 } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [entered, setEntered] = useState(false);

  const features = [
    {
      icon: Eye,
      title: "Watch Any Address",
      description: "Monitor any wallet address in real-time. Track DeFi positions, collateral, and health factors as they change."
    },
    {
      icon: Activity,
      title: "Live Block Updates",
      description: "Watch the blockchain update in real-time without refreshing. New blocks and transactions appear instantly."
    },
    {
      icon: Zap,
      title: "Reactivity SDK",
      description: "Powered by Somnia's Reactivity SDK - push notifications when data changes, no polling, no delays."
    },
    {
      icon: Bell,
      title: "Smart Alerts",
      description: "Set alerts for health factor thresholds. Get notified instantly when positions approach liquidation."
    },
    {
      icon: Shield,
      title: "Risk Monitoring",
      description: "Track health factors, liquidation risks, and portfolio health across multiple addresses."
    },
    {
      icon: BarChart3,
      title: "Analytics",
      description: "View live network stats including block times, gas prices, and protocol metrics."
    }
  ];

  const steps = [
    {
      step: 1,
      title: "Connect Wallet",
      description: "Connect your wallet to view your portfolio data on Tokos lending protocol."
    },
    {
      step: 2,
      title: "Watch Addresses",
      description: "Enter any wallet address to monitor their DeFi positions in real-time."
    },
    {
      step: 3,
      title: "Set Alerts",
      description: "Configure alerts for health factor thresholds and get notified of changes."
    },
    {
      step: 4,
      title: "Track Whales",
      description: "Monitor multiple addresses and see activity feed of all position changes."
    }
  ];

  const techStack = [
    { name: "Somnia Network", description: "High-performance blockchain with sub-second finality" },
    { name: "Reactivity SDK", description: "Real-time push notifications for on-chain events" },
    { name: "Tokos Protocol", description: "Native lending platform on Somnia" },
    { name: "viem", description: "Ethereum RPC calls and contract interactions" },
    { name: "Next.js", description: "React framework for the dashboard UI" }
  ];

  if (entered) {
    router.push("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/5 via-transparent to-transparent"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-cyan/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-6xl mx-auto px-6 py-24 relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-accent-cyan bg-clip-text text-transparent">
              DeFi Pulse
            </h1>
            <p className="text-xl md:text-2xl text-text-secondary max-w-2xl mx-auto mb-8">
              Real-time DeFi monitoring dashboard powered by Somnia Reactivity SDK
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-accent-cyan text-black font-bold text-lg rounded-xl hover:bg-accent-cyan/90 transition-all hover:scale-105"
            >
              Enter Dashboard
              <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16">
            <div className="text-center">
              <p className="text-4xl font-bold text-accent-cyan">6</p>
              <p className="text-text-secondary text-sm">Features</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-accent-cyan">Real-time</p>
              <p className="text-text-secondary text-sm">Updates</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-accent-cyan">0</p>
              <p className="text-text-secondary text-sm">Polling</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div key={i} className="bg-card border border-card-border rounded-xl p-6 hover:border-accent-cyan/50 transition-colors">
              <div className="p-3 bg-accent-cyan/10 rounded-lg w-fit mb-4">
                <feature.icon size={24} className="text-accent-cyan" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-text-secondary text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-card-border/30 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                <div className="bg-card border border-card-border rounded-xl p-6">
                  <div className="w-10 h-10 bg-accent-cyan/20 rounded-full flex items-center justify-center mb-4">
                    <span className="text-accent-cyan font-bold">{step.step}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-text-secondary text-sm">{step.description}</p>
                </div>
                {i < steps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute top-1/2 -right-4 text-text-tertiary -translate-y-1/2" size={24} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Tech Stack</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
          {techStack.map((tech, i) => (
            <div key={i} className="bg-card border border-card-border rounded-xl p-4 text-center">
              <p className="font-semibold text-accent-cyan mb-1">{tech.name}</p>
              <p className="text-text-tertiary text-xs">{tech.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-accent-cyan/10 to-transparent py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Monitor?</h2>
          <p className="text-text-secondary mb-8">
            Start tracking DeFi positions in real-time with Somnia Reactivity SDK
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="inline-flex items-center gap-3 px-8 py-4 bg-accent-cyan text-black font-bold text-lg rounded-xl hover:bg-accent-cyan/90 transition-all hover:scale-105"
          >
            Launch Dashboard
            <ArrowRight size={24} />
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-card-border py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-tertiary text-sm">
            DeFi Pulse - Built for Somnia Reactivity Mini Hackathon
          </p>
          <p className="text-text-tertiary text-sm">
            Powered by Reactivity SDK - No Polling, Just Push
          </p>
        </div>
      </footer>
    </div>
  );
}
