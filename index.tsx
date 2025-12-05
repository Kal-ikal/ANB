import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight, Calendar, BarChart2, Users, Shield } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Retro Space Game Component
const RetroGame = () => {
  const [playerX, setPlayerX] = useState(SCREEN_WIDTH / 2 - 20);
  const [score, setScore] = useState(0);
  const [enemies, setEnemies] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const [bullets, setBullets] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const [stars, setStars] = useState<Array<{ x: number; y: number; size: number }>>([]);

  const gameLoop = useRef<NodeJS.Timeout | null>(null);
  const bulletCounter = useRef(0);
  const enemyCounter = useRef(0);

  // Initialize stars
  useEffect(() => {
    const newStars = Array.from({ length: 100 }, (_, i) => ({
      x: Math.random() * SCREEN_WIDTH,
      y: Math.random() * 400,
      size: Math.random() * 2 + 1,
    }));
    setStars(newStars);
  }, []);

  // Game loop
  useEffect(() => {
    gameLoop.current = setInterval(() => {
      // Move bullets
      setBullets(prev => prev
        .map(b => ({ ...b, y: b.y - 10 }))
        .filter(b => b.y > 0)
      );

      // Move enemies
      setEnemies(prev => prev
        .map(e => ({ ...e, y: e.y + 2 }))
        .filter(e => e.y < 400)
      );

      // Spawn new enemy randomly
      if (Math.random() < 0.02) {
        setEnemies(prev => [...prev, {
          x: Math.random() * (SCREEN_WIDTH - 40),
          y: 0,
          id: enemyCounter.current++
        }]);
      }

      // Check collisions
      setBullets(prevBullets => {
        const remainingBullets = [...prevBullets];

        setEnemies(prevEnemies => {
          const remainingEnemies = prevEnemies.filter(enemy => {
            const hit = remainingBullets.some(bullet =>
              Math.abs(bullet.x - enemy.x) < 30 &&
              Math.abs(bullet.y - enemy.y) < 30
            );

            if (hit) {
              setScore(s => s + 10);
              const hitBulletIndex = remainingBullets.findIndex(bullet =>
                Math.abs(bullet.x - enemy.x) < 30 &&
                Math.abs(bullet.y - enemy.y) < 30
              );
              if (hitBulletIndex !== -1) {
                remainingBullets.splice(hitBulletIndex, 1);
              }
            }

            return !hit;
          });

          return remainingEnemies;
        });

        return remainingBullets;
      });
    }, 50);

    return () => {
      if (gameLoop.current) clearInterval(gameLoop.current);
    };
  }, []);

  const movePlayer = (direction: 'left' | 'right') => {
    setPlayerX(prev => {
      if (direction === 'left') {
        return Math.max(0, prev - 30);
      } else {
        return Math.min(SCREEN_WIDTH - 40, prev + 30);
      }
    });
  };

  const shoot = () => {
    setBullets(prev => [...prev, {
      x: playerX + 15,
      y: 340,
      id: bulletCounter.current++
    }]);
  };

  return (
    <View className="w-full h-96 bg-gray-900 rounded-2xl overflow-hidden relative">
      {/* Stars background */}
      {stars.map((star, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            left: star.x,
            top: star.y,
            width: star.size,
            height: star.size,
            backgroundColor: '#fff',
            borderRadius: star.size / 2,
            opacity: 0.8,
          }}
        />
      ))}

      {/* Score */}
      <View className="absolute top-4 left-4 z-10">
        <Text className="text-white font-bold text-xl">Score: {score}</Text>
      </View>

      {/* Enemies */}
      {enemies.map(enemy => (
        <View
          key={enemy.id}
          style={{
            position: 'absolute',
            left: enemy.x,
            top: enemy.y,
            width: 40,
            height: 40,
          }}
        >
          {/* Pixel art enemy (space invader style) */}
          <View className="flex-1">
            <View className="flex-row justify-center">
              <View className="w-2 h-2 bg-red-500" />
              <View className="w-2 h-2 bg-transparent" />
              <View className="w-2 h-2 bg-transparent" />
              <View className="w-2 h-2 bg-transparent" />
              <View className="w-2 h-2 bg-red-500" />
            </View>
            <View className="flex-row justify-center">
              <View className="w-2 h-2 bg-transparent" />
              <View className="w-2 h-2 bg-red-500" />
              <View className="w-2 h-2 bg-transparent" />
              <View className="w-2 h-2 bg-red-500" />
              <View className="w-2 h-2 bg-transparent" />
            </View>
            <View className="flex-row justify-center">
              <View className="w-2 h-2 bg-red-500" />
              <View className="w-2 h-2 bg-red-500" />
              <View className="w-2 h-2 bg-red-500" />
              <View className="w-2 h-2 bg-red-500" />
              <View className="w-2 h-2 bg-red-500" />
            </View>
            <View className="flex-row justify-center">
              <View className="w-2 h-2 bg-red-500" />
              <View className="w-2 h-2 bg-transparent" />
              <View className="w-2 h-2 bg-red-500" />
              <View className="w-2 h-2 bg-transparent" />
              <View className="w-2 h-2 bg-red-500" />
            </View>
            <View className="flex-row justify-center">
              <View className="w-2 h-2 bg-transparent" />
              <View className="w-2 h-2 bg-red-500" />
              <View className="w-2 h-2 bg-transparent" />
              <View className="w-2 h-2 bg-red-500" />
              <View className="w-2 h-2 bg-transparent" />
            </View>
          </View>
        </View>
      ))}

      {/* Bullets */}
      {bullets.map(bullet => (
        <View
          key={bullet.id}
          style={{
            position: 'absolute',
            left: bullet.x,
            top: bullet.y,
            width: 4,
            height: 12,
            backgroundColor: '#00ff00',
            borderRadius: 2,
          }}
        />
      ))}

      {/* Player ship (pixel art style) */}
      <View
        style={{
          position: 'absolute',
          left: playerX,
          bottom: 40,
          width: 40,
          height: 40,
        }}
      >
        <View className="flex-1">
          <View className="flex-row justify-center">
            <View className="w-2 h-2 bg-transparent" />
            <View className="w-2 h-2 bg-transparent" />
            <View className="w-2 h-2 bg-blue-400" />
            <View className="w-2 h-2 bg-transparent" />
            <View className="w-2 h-2 bg-transparent" />
          </View>
          <View className="flex-row justify-center">
            <View className="w-2 h-2 bg-transparent" />
            <View className="w-2 h-2 bg-blue-400" />
            <View className="w-2 h-2 bg-blue-400" />
            <View className="w-2 h-2 bg-blue-400" />
            <View className="w-2 h-2 bg-transparent" />
          </View>
          <View className="flex-row justify-center">
            <View className="w-2 h-2 bg-blue-400" />
            <View className="w-2 h-2 bg-blue-400" />
            <View className="w-2 h-2 bg-blue-400" />
            <View className="w-2 h-2 bg-blue-400" />
            <View className="w-2 h-2 bg-blue-400" />
          </View>
          <View className="flex-row justify-center">
            <View className="w-2 h-2 bg-blue-400" />
            <View className="w-2 h-2 bg-transparent" />
            <View className="w-2 h-2 bg-blue-400" />
            <View className="w-2 h-2 bg-transparent" />
            <View className="w-2 h-2 bg-blue-400" />
          </View>
        </View>
      </View>

      {/* Controls */}
      <View className="absolute bottom-4 left-0 right-0 flex-row justify-center gap-4 px-4">
        <TouchableOpacity
          onPress={() => movePlayer('left')}
          className="bg-blue-500 py-3 px-8 rounded-lg"
        >
          <Text className="text-white font-bold text-lg">←</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={shoot}
          className="bg-green-500 py-3 px-8 rounded-lg"
        >
          <Text className="text-white font-bold text-lg">FIRE</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => movePlayer('right')}
          className="bg-blue-500 py-3 px-8 rounded-lg"
        >
          <Text className="text-white font-bold text-lg">→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const LandingScreen = () => {
  const router = useRouter();
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: <Calendar color="#3B82F6" size={24} />,
      title: "Easy Leave Requests",
      description: "Apply for leave in seconds with our intuitive interface"
    },
    {
      icon: <BarChart2 color="#10B981" size={24} />,
      title: "Track Usage",
      description: "Visualize your leave patterns with interactive charts"
    },
    {
      icon: <Users color="#8B5CF6" size={24} />,
      title: "Team Coordination",
      description: "See team availability and plan accordingly"
    },
    {
      icon: <Shield color="#F59E0B" size={24} />,
      title: "Secure & Reliable",
      description: "Enterprise-grade security for your data"
    }
  ];

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="pt-12 pb-6 px-6 bg-blue-50">
        <View className="flex-row justify-between items-center">
          <Text className="text-2xl font-bold text-blue-600">LeaveManager Pro</Text>
          <TouchableOpacity 
            onPress={() => router.push('/login')}
            className="py-2 px-4 rounded-lg bg-white border border-blue-200"
          >
            <Text className="text-blue-600 font-medium">Login</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View className="px-6 pt-8 pb-12 items-center">
          <Text className="text-3xl font-bold text-center text-gray-800 mb-4">
            Simplify Your Leave Management
          </Text>
          <Text className="text-gray-600 text-center text-lg mb-4 max-w-md">
            Track, request, and manage your leave entitlements with ease. All in one place.
          </Text>

          <Text className="text-blue-600 text-center font-bold mb-4">
            🎮 Play a quick game while you explore!
          </Text>

          <View className="w-full mb-8">
            <RetroGame />
          </View>
          
          <TouchableOpacity 
            onPress={() => router.push('/register')}
            className="w-full py-4 rounded-xl bg-blue-600 items-center mb-6"
          >
            <Text className="text-white text-lg font-bold">Get Started</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => router.push('/login')}
            className="w-full py-4 rounded-xl bg-white border border-gray-300 items-center"
          >
            <Text className="text-gray-800 text-lg font-medium">I Already Have an Account</Text>
          </TouchableOpacity>
        </View>

        {/* Features Section */}
        <View className="px-6 pb-12">
          <Text className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Why Choose LeaveManager Pro?
          </Text>
          
          <View className="flex-row flex-wrap gap-4">
            {features.map((feature, index) => (
              <View 
                key={index}
                className="flex-1 min-w-[45%] bg-white rounded-xl p-5 shadow-sm border border-gray-100"
              >
                <View className="mb-3">
                  {feature.icon}
                </View>
                <Text className="text-lg font-semibold text-gray-800 mb-2">
                  {feature.title}
                </Text>
                <Text className="text-gray-600">
                  {feature.description}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Testimonial Section */}
        <View className="px-6 pb-12 bg-blue-50 py-8">
          <Text className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Trusted by Thousands
          </Text>
          
          <View className="bg-white rounded-xl p-6 shadow-sm">
            <Text className="text-gray-600 italic mb-4">
              "LeaveManager Pro has transformed how our team handles leave requests. 
              The dashboard visualization helps us plan better than ever before."
            </Text>
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-gray-200 mr-3" />
              <View>
                <Text className="font-semibold text-gray-800">Sarah Johnson</Text>
                <Text className="text-gray-600">HR Director, TechCorp</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default LandingScreen;