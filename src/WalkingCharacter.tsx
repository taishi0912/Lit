import React, { useState, useEffect, useCallback } from 'react';

const WalkingCharacter = () => {
  const [position, setPosition] = useState(0);
  const [isWalking, setIsWalking] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [currentScene, setCurrentScene] = useState(0);
  const [backgroundPosition, setBackgroundPosition] = useState(0);
  const [direction, setDirection] = useState('right');
  const [lastUpdateTime, setLastUpdateTime] = useState(0);
  const [isHoodOn, setIsHoodOn] = useState(true);
  const [isWindBlowing, setIsWindBlowing] = useState(false);
  
  const ANIMATION_INTERVAL = 100;
  const MOVEMENT_SPEED = 3;
  const BACKGROUND_SCROLL_SPEED = 2;

  const scenes = [
    { 
      name: '卒業',
      sky: 'bg-yellow-300',
      ground: 'bg-green-900',
      message: '卒業'
    },
    { 
      name: '受験失敗',
      sky: 'bg-gray-700',
      ground: 'bg-green-900',
      message: '大学受験失敗',
      isRaining: true
    },
    { 
      name: '再挑戦',
      sky: 'bg-orange-500',
      ground: 'bg-green-900',
      message: '転入学試験挑戦'
    },
    { 
      name: '再会',
      sky: 'bg-sky-300',
      ground: 'bg-green-900',
      message: '憧れのメンターとの再会'
    },
    { 
      name: 'ハッカソン',
      sky: 'bg-indigo-900',
      ground: 'bg-green-900',
      message: 'ハッカソンで連続受賞'
    },
    { 
      name: '挑戦',
      sky: 'bg-sky-300',
      ground: 'bg-green-900',
      message: 'メンターへの挑戦'
    }
  ];

    // 高層ビル（背景用）
    const SkyscraperBackground = ({ position }) => (
      <div 
        className="absolute bottom-24"
        style={{ left: `${position}px` }}
      >
        {/* 中央の高層ビル */}
        <div className="relative w-screen h-96">
          {/* メインタワー */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-48 h-96 bg-slate-700">
            <div className="absolute inset-2 grid grid-cols-6 gap-1">
              {[...Array(72)].map((_, i) => (
                <div key={i} className="w-full h-4 bg-sky-200 bg-opacity-30" />
              ))}
            </div>
            {/* 頂上部分 */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-24 h-8 bg-slate-800 rounded-t-lg" />
          </div>
          
          {/* 左のビル群 */}
          <div className="absolute bottom-0 left-20 w-32 h-72 bg-slate-600">
            <div className="absolute inset-1 grid grid-cols-4 gap-1">
              {[...Array(48)].map((_, i) => (
                <div key={i} className="w-full h-4 bg-sky-200 bg-opacity-30" />
              ))}
            </div>
          </div>
          
          {/* 右のビル群 */}
          <div className="absolute bottom-0 right-20 w-32 h-80 bg-slate-800">
            <div className="absolute inset-1 grid grid-cols-4 gap-1">
              {[...Array(52)].map((_, i) => (
                <div key={i} className="w-full h-4 bg-sky-200 bg-opacity-30" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
    
  
  // 雲のコンポーネント
  const Cloud = ({ initialPosition }) => (
    <div 
      className="absolute"
      style={{ 
        left: `${initialPosition + backgroundPosition}px`,
        top: '20%'
      }}
    >
      <div className="w-16 h-4 bg-white rounded-full opacity-80" />
    </div>
  );

  // 小さなビルとメンター
  const SmallOffice = ({ position }) => (
    <div 
      className="absolute bottom-24"
      style={{ left: `${position}px` }}
    >
      <div className="relative w-48 h-48">
        {/* 小さめのビル */}
        <div className="absolute bottom-0 w-full h-40 bg-gray-300">
          {/* 窓 */}
          <div className="grid grid-cols-4 gap-2 p-2">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="w-full h-4 bg-yellow-100" />
            ))}
          </div>
          {/* ドア */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-16 bg-gray-600" />
        </div>
      </div>
    </div>
  );

  // オリジナルのメンターグループ
  const Mentors = ({ position }) => (
    <div 
      className="absolute bottom-24"
      style={{ left: `${position}px` }}
    >
      <div className="flex space-x-4">
        {/* メンターA: 金髪ロング */}
        <div className="relative w-8 h-16">
          <div className="absolute top-0 w-6 h-6 bg-yellow-200 rounded-full">
            <div className="absolute -top-1 -left-1 w-8 h-6 bg-yellow-600 rounded-t-lg" />
            <div className="absolute top-2 left-1 w-4 h-1 bg-gray-800 rounded-full" />
          </div>
          <div className="absolute top-6 w-8 h-10 bg-purple-900" />
        </div>
        {/* メンターB: 赤髪ショート */}
        <div className="relative w-8 h-16">
          <div className="absolute top-0 w-6 h-6 bg-yellow-200 rounded-full">
            <div className="absolute -top-1 -left-1 w-8 h-4 bg-red-700 rounded-t-lg" />
            <div className="absolute top-2 left-1 w-4 h-1 bg-gray-800 rounded-full" />
          </div>
          <div className="absolute top-6 w-8 h-10 bg-blue-900" />
        </div>
        {/* メンターC: 白髪ミディアム */}
        <div className="relative w-8 h-16">
          <div className="absolute top-0 w-6 h-6 bg-yellow-200 rounded-full">
            <div className="absolute -top-1 -left-1 w-8 h-5 bg-gray-300 rounded-t-lg" />
            <div className="absolute top-2 left-1 w-4 h-1 bg-gray-800 rounded-full" />
          </div>
          <div className="absolute top-6 w-8 h-10 bg-gray-900" />
        </div>
      </div>
    </div>
  );

  // 新しいメンターグループ
  const NewMentors = ({ position }) => (
    <div 
      className="absolute bottom-24"
      style={{ left: `${position}px`,
      zIndex: 10,
    }}
    >
      <div className="flex space-x-4">
        {/* メンターD: 緑髪ツーブロック */}
        <div className="relative w-8 h-16">
          <div className="absolute top-0 w-6 h-6 bg-yellow-200 rounded-full">
            <div className="absolute -top-1 -left-1 w-8 h-4 bg-emerald-600 rounded-t-lg" />
            <div className="absolute top-2 left-1 w-4 h-1 bg-gray-800 rounded-full" />
          </div>
          <div className="absolute top-6 w-8 h-10 bg-teal-900" />
        </div>
        {/* メンターE: ピンク髪ロング */}
        <div className="relative w-8 h-16">
          <div className="absolute top-0 w-6 h-6 bg-yellow-200 rounded-full">
            <div className="absolute -top-1 -left-1 w-8 h-6 bg-pink-400 rounded-t-lg" />
            <div className="absolute top-2 left-1 w-4 h-1 bg-gray-800 rounded-full" />
          </div>
          <div className="absolute top-6 w-8 h-10 bg-indigo-900" />
        </div>
        {/* メンターF: 青髪ボブ */}
        <div className="relative w-8 h-16">
          <div className="absolute top-0 w-6 h-6 bg-yellow-200 rounded-full">
            <div className="absolute -top-1 -left-1 w-8 h-5 bg-blue-500 rounded-t-lg" />
            <div className="absolute top-2 left-1 w-4 h-1 bg-gray-800 rounded-full" />
          </div>
          <div className="absolute top-6 w-8 h-10 bg-violet-900" />
        </div>
      </div>
    </div>
  );

  // 後ろで応援する仲間たち
  const SupportingMembers = ({ position }) => (
    <div 
      className="absolute bottom-24"
      style={{ left: `${position - 30}px` }}
    >
      <div className="flex space-x-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="relative w-8 h-16 opacity-80">
            <div className="absolute top-0 w-6 h-6 bg-yellow-200 rounded-full">
              <div className={`absolute -top-1 -left-1 w-8 h-5 ${
                ['bg-gray-800', 'bg-brown-700', 'bg-gray-700', 'bg-brown-800'][i]
              } rounded-t-lg`} />
            </div>
            <div className="absolute top-6 w-8 h-10 bg-gray-700" />
          </div>
        ))}
      </div>
    </div>
  );

  // メンバーグループ
  const Members = ({ position }) => (
    <div 
      className="absolute bottom-24"
      style={{ left: `${position}px` }}
    >
      <div className="flex space-x-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="relative w-8 h-16">
            <div className="absolute top-0 w-6 h-6 bg-yellow-200 rounded-full">
              <div className={`absolute -top-1 -left-1 w-8 h-5 ${
                ['bg-gray-800', 'bg-brown-700', 'bg-gray-700', 'bg-brown-800'][i]
              } rounded-t-lg`} />
            </div>
            <div className="absolute top-6 w-8 h-10 bg-gray-700" />
          </div>
        ))}
      </div>
    </div>
  );

  // 学校の建物
  const School = ({ position }) => (
    <div 
      className="absolute bottom-24"
      style={{ left: `${position}px` }}
    >
      <div className="relative w-64 h-48">
        <div className="absolute bottom-0 w-64 h-40 bg-gray-200">
          <div className="grid grid-cols-4 gap-2 p-2">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="w-full h-6 bg-sky-200" />
            ))}
          </div>
        </div>
        <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-white">
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-8 h-8 border-4 border-gray-400 rounded-full" />
        </div>
      </div>
    </div>
  );

  // 会話バブル（複数表示可能なバージョン）
  const ChatBubble = ({ text, position, isLeft, offsetY = 0, offsetX = 0 }) => (
    <div 
      className={`absolute ${isLeft ? '-right-20' : '-left-20'}`}
      style={{ 
        left: `${position + offsetX}px`,
        bottom: `${144 + offsetY}px`,
        maxWidth: '200px',
        transform: 'scale(0.8)',  // バブルを少し小さくする
        zIndex: 30, // 会場よりも前面に配置
      }}
    >
      <div className="relative">
        <div className="bg-white rounded-lg px-3 py-2 text-sm whitespace-normal">
          {text}
        </div>
        <div className={`absolute -bottom-1 ${isLeft ? 'right-2' : 'left-2'} w-2 h-2 bg-white transform rotate-45`} />
      </div>
    </div>
  );

  // 再会シーンの状態管理
  const [isMeetingPaused, setIsMeetingPaused] = useState(false);
  const [chatIndex, setChatIndex] = useState(0);

  useEffect(() => {
    if (currentScene === 3) { // 再会シーン
      setIsMeetingPaused(true);
      const timer = setTimeout(() => {
        setIsMeetingPaused(false);
      }, 5000); // 5秒後に歩き出す
      return () => clearTimeout(timer);
    } else {
      setIsMeetingPaused(false);
    }
  }, [currentScene]);

  // メンター
  const Mentor = ({ position }) => (
    <div 
      className="absolute bottom-24"
      style={{ left: `${position}px` }}
    >
      <div className="relative w-8 h-16">
        <div className="absolute top-0 w-6 h-6 bg-yellow-200 rounded-full">
          <div className="absolute -top-1 -left-1 w-8 h-5 bg-gray-600 rounded-t-lg" />
          <div className="absolute top-2 left-1 w-4 h-1 bg-gray-800" />
        </div>
        <div className="absolute top-6 w-8 h-10 bg-gray-800" />
      </div>
    </div>
  );

  // ストーリーメッセージ
  const StoryMessage = ({ message, position }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
      // メッセージが変わったら表示する
      setIsVisible(true);
      // 3秒後に非表示
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    }, [message]);

    if (!isVisible) return null;

    return (
      <div 
        className="absolute top-12 z-10 transition-opacity duration-500"
        style={{ 
          left: `${position}px`,
          opacity: isVisible ? 1 : 0
        }}
      >
        <div className={`px-4 py-2 rounded text-white font-bold whitespace-nowrap ${
          message === 'メンバー卒業' ? 'bg-olive-800' :
          message === '大学受験失敗' ? 'bg-red-800' :
          message === '転入学試験挑戦' ? 'bg-orange-800' :
          message === '憧れのメンターとの再会' ? 'bg-blue-800' :
          message === 'ハッカソンで連続受賞' ? 'bg-purple-800' :
          'bg-green-800'
        }`}>
          {message}
        </div>
      </div>
    );
  };


  // ハッカソン会場
  const HackathonVenue = ({ position }) => (
    <div 
      className="absolute bottom-24"
      style={{ left: `${position}px` }}
    >
      {/* イベントスペース */}
      <div className="relative w-64 h-32 bg-purple-900 rounded-lg">
        {/* 大きなスクリーン */}
        <div className="absolute top-4 left-4 right-4 h-12 bg-blue-200" />
        {/* デスクエリア */}
        <div className="absolute bottom-4 left-4 right-4 h-8 bg-gray-200" />
      </div>
    </div>
  );

  // 風のエフェクト
  const WindEffect = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute h-0.5 bg-white/30"
          style={{
            left: `${-20 + (i * 5)}%`,
            top: `${Math.random() * 100}%`,
            width: '100px',
            animation: 'windBlow 1s linear infinite'
          }}
        />
      ))}
    </div>
  );

  // 雨のエフェクト
  const RainEffect = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute w-0.5 h-4 bg-blue-200/60"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `rainfall ${0.5 + Math.random()}s linear infinite`
          }}
        />
      ))}
    </div>
  );

  // 歩行アニメーション
  const getAnimationStyle = (phase) => {
    const yOffset = Math.sin(phase * Math.PI) * 1;
    return {
      body: `translateY(${yOffset}px)`,
      leftLeg: `translateY(${Math.sin((phase + 0.5) * Math.PI)}px)`,
      rightLeg: `translateY(${Math.sin(phase * Math.PI)}px)`,
    };
  };

  useEffect(() => {
    // 一定時間後に風が吹く
    const windTimeout = setTimeout(() => {
      setIsWindBlowing(true);
      setTimeout(() => {
        setIsHoodOn(false);
        setTimeout(() => {
          setIsWindBlowing(false);
        }, 1000);
      }, 500);
    }, 5000);

    return () => clearTimeout(windTimeout);
  }, []);

  const moveCharacter = useCallback(() => {
    if (isWalking && !isMeetingPaused) {
      const currentTime = Date.now();
      if (currentTime - lastUpdateTime >= ANIMATION_INTERVAL) {
        setLastUpdateTime(currentTime);
        setAnimationPhase(prev => (prev + 0.25) % 2);

        const step = direction === 'right' ? MOVEMENT_SPEED : -MOVEMENT_SPEED;
        
        setPosition(prev => {
          const newPosition = prev + step;
          if (Math.abs(newPosition) > window.innerWidth * 0.2) {
            setBackgroundPosition(prevBg => prevBg - (step * BACKGROUND_SCROLL_SPEED));
            return window.innerWidth * 0.2 * (direction === 'right' ? 1 : -1);
          }
          return newPosition;
        });

        setBackgroundPosition(prev => {
          if (Math.abs(prev) > window.innerWidth * 0.8) {
            setCurrentScene(current => (current + 1) % scenes.length);
            return 0;
          }
          return prev;
        });
      }
    }
  }, [isWalking, direction, scenes.length, lastUpdateTime, isMeetingPaused]);

  useEffect(() => {
    let animationFrameId;
    const animate = () => {
      moveCharacter();
      animationFrameId = requestAnimationFrame(animate);
    };
    
    if (isWalking) {
      animationFrameId = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isWalking, moveCharacter]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case ' ':
          setIsWalking(prev => !prev);
          break;
        case 'ArrowLeft':
          setDirection('left');
          break;
        case 'ArrowRight':
          setDirection('right');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const currentAnimation = getAnimationStyle(animationPhase);

  return (
    <div className="w-full h-96 relative overflow-hidden">
      {/* 空と背景 */}
      <div className={`w-full h-full ${scenes[currentScene].sky} transition-colors duration-1000`}>
        {/* 風のエフェクト */}
        {isWindBlowing && <WindEffect />}

        {/* メッセージ */}
        <StoryMessage 
          message={scenes[currentScene].message} 
          position={position - 60} 
        />

        {/* 雲 */}
        {!scenes[currentScene].isRaining && (
          <div className="absolute inset-0">
            <Cloud initialPosition={window.innerWidth * 0.2} />
            <Cloud initialPosition={window.innerWidth * 0.5} />
            <Cloud initialPosition={window.innerWidth * 0.8} />
          </div>
        )}
        
        {/* 雨 */}
        {scenes[currentScene].isRaining && <RainEffect />}

        {/* 最初のシーン（卒業） */}
        {currentScene === 0 && (
          <>
            <SmallOffice position={window.innerWidth * 0.5 + backgroundPosition} />
            <Mentors position={window.innerWidth * 0.5 + backgroundPosition + 20} />
            {/* メンターたちの会話 */}
            <ChatBubble 
              text="卒業おめでとう！"
              position={window.innerWidth * 0.5 + backgroundPosition + 20} 
              isLeft={true}
              offsetY={60}
            />
            {/* 主人公の会話 */}
            <ChatBubble 
              text="大学合格してメンターになって帰ってきます！"
              position={position} 
              isLeft={false}
              offsetY={30}
              offsetX={-20}
            />
          </>
        )}

        {/* 受験失敗シーン */}
        {currentScene === 1 && (
          <ChatBubble 
            text="憧れのメンターさんと同じ大学に絶対に行く！"
            position={position} 
            isLeft={false}
            offsetY={30}
          />
        )}

        {/* 転入学試験シーン */}
        {currentScene === 2 && (
          <ChatBubble 
            text="プログラミングで学習効率を上げるツールを開発してみよう！"
            position={position} 
            isLeft={false}
            offsetY={30}
          />
        )}

        {/* メンター再会シーン */}
        {currentScene === 3 && (
          <>
            {isMeetingPaused && (
              <>
                <Mentors position={position + 30} />
                <ChatBubble 
                  text="久しぶりです！"
                  position={position} 
                  isLeft={false}
                  offsetY={60}
                />
                <ChatBubble 
                  text="合格おめでとう！"
                  position={position + 30} 
                  isLeft={true}
                  offsetY={30}
                />
              </>
            )}
          </>
        )}
                {/* ハッカソンシーン */}
                {currentScene === 4 && (
          <>
            <SkyscraperBackground position={window.innerWidth * 0.5 + backgroundPosition} />
            
            <ChatBubble 
              text="メンターとしてメンバーを支えられる技術力やコミュニケーション力をつける！"
              position={position} 
              isLeft={false}
              offsetY={30}
            />
          </>
        )}


        {/* 最終シーン */}
        {currentScene === scenes.length - 1 && (
          <>
            <SmallOffice position={window.innerWidth * 0.5 + backgroundPosition} />
            <NewMentors position={window.innerWidth * 0.5 + backgroundPosition + 20} />
            <SupportingMembers position={position} />
            <Mentors position={position - 40} />
            <ChatBubble 
              text="今度は僕が次代のエンジニアたちを支える番です！"
              position={position} 
              isLeft={false}
              offsetY={30}
            />
            <ChatBubble 
              text="モノづくりの楽しさを一緒に教えよう！"
              position={window.innerWidth * 0.5 + backgroundPosition + 20} 
              isLeft={true}
              offsetY={30}
            />
          </>
        )}

        {/* 地面 */}
        <div className={`absolute bottom-0 w-full h-24 ${scenes[currentScene].ground}`}>
          {/* 草 */}
          <div className="absolute bottom-full w-full">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute bottom-0 w-1 h-2 bg-green-800"
                style={{ left: `${i * 5 + (backgroundPosition % 5)}%` }}
              />
            ))}
          </div>
        </div>

        {/* キャラクター */}
        <div
          className="absolute bottom-24 transition-all duration-200"
          style={{
            left: `${position}px`,
            transform: `scaleX(${direction === 'left' ? -1 : 1})`,
            zIndex: 20, 
          }}
        >
          <div className="relative w-8 h-16" style={{ transform: currentAnimation.body }}>
            {/* 頭 */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-yellow-100">
              {/* フード */}
              {isHoodOn && (
                <div className={`absolute -top-1 -left-2 w-8 h-8 bg-white rounded-t-lg transition-transform duration-500 ${isWindBlowing ? 'animate-windBlow' : ''}`} />
              )}
              {/* 髪 */}
              <div className="absolute -top-1 -left-1 w-8 h-5 bg-gray-900 rounded-t-lg" />
            </div>
            
            {/* パーカー */}
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-8 h-6 bg-white">
              {/* ポケット */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-4 h-2 bg-gray-100" />
              {/* フード */}
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-gray-200" />
            </div>

            {/* ズボン */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-4 bg-blue-900">
              <div 
                className="absolute bottom-0 left-0 w-2 h-3 bg-blue-900 transition-transform duration-200"
                style={{ transform: currentAnimation.leftLeg }}
              />
              <div 
                className="absolute bottom-0 right-0 w-2 h-3 bg-blue-900 transition-transform duration-200"
                style={{ transform: currentAnimation.rightLeg }}
              />
            </div>

            {/* スニーカー */}
            <div 
              className="absolute -bottom-1 left-0 w-2 h-1 bg-white transition-transform duration-200"
              style={{ transform: currentAnimation.leftLeg }}
            />
            <div 
              className="absolute -bottom-1 right-0 w-2 h-1 bg-white transition-transform duration-200"
              style={{ transform: currentAnimation.rightLeg }}
            />

            {/* 雨の場合は傘を表示 */}
            {scenes[currentScene].isRaining && (
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                <div className="w-12 h-8 bg-purple-600 rounded-t-full" />
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-1 h-4 bg-purple-800" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 space-x-4">
        <button
          className={`px-6 py-2 rounded-full font-bold transition-colors ${
            isWalking ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
          }`}
          onClick={() => setIsWalking(!isWalking)}
        >
          {isWalking ? '停止' : '歩く'}
        </button>
      </div>

      <style jsx global>{`
        @keyframes rainfall {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes windBlow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX( 100%); }
        }
        .animate-windBlow {
          animation: hood-blow-off 0.5s forwards;
        }
        @keyframes hood-blow-off {
          0% { transform: translateX(0) rotate(0deg); }
          100% { transform: translateX(50px) rotate(20deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default WalkingCharacter;