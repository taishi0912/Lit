import React, { useState, useEffect, useCallback } from 'react';

const WalkingCharacter = () => {
  const [position, setPosition] = useState(0);
  const [isWalking, setIsWalking] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [isKneeling, setIsKneeling] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const [backgroundPosition, setBackgroundPosition] = useState(0);
  const [direction, setDirection] = useState('right');
  const [lastUpdateTime, setLastUpdateTime] = useState(0);
  const [isHoodOn, setIsHoodOn] = useState(true);
  const [isWindBlowing, setIsWindBlowing] = useState(false);
  const [isPausedForKneeling, setIsPausedForKneeling] = useState(false);

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
  
  const Certification = ({ characterPosition }) => (
    <div
      className="absolute w-32 h-20 bg-gradient-to-r from-red-400 via-yellow-400 to-blue-400 border-4 border-blue-500 flex items-center justify-center text-lg font-bold text-white shadow-lg"
      style={{
        left: `${characterPosition}px`, // 主人公の位置に配置
        top: `-50px`, // 初期位置を画面上部に設定
        animation: "certFall 5s ease-in forwards",
      }}
    >
      認定証
    </div>
  );

//工事
  const ConstructionSiteBackground = ({ position }) => (
    <div 
      className="absolute bottom-24"
      style={{ left: `${position}px`, zIndex: 5 }}
    >
      <div className="relative w-screen">
        {/* 工事現場の要素群 */}
        <div className="absolute bottom-0 left-0 w-full flex justify-around">
          {/* 工事現場の囲い */}
          <div className="absolute bottom-0 w-full h-16 flex overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex-1 h-full">
                <div className="w-full h-full border-2 border-yellow-500 bg-yellow-500/20 flex items-center justify-center">
                  <div className="transform -rotate-12 text-yellow-500 font-bold">工事中</div>
                </div>
              </div>
            ))}
          </div>
  
          {/* 建設中の高層ビル */}
          <div className="relative w-64 h-[400px]">
            {/* コンクリートの骨組み */}
            <div className="absolute bottom-0 w-full h-full bg-gray-700">
              <div className="absolute inset-2 grid grid-cols-4 gap-4">
                {[...Array(24)].map((_, i) => (
                  <div key={i} className="w-full h-8 border-2 border-gray-600" />
                ))}
              </div>
            </div>
            {/* 足場と養生シート */}
            <div className="absolute inset-y-0 -left-4 w-8 bg-gray-800/50">
              <div className="absolute inset-0 bg-blue-200/10 animate-pulse" />
              <div className="absolute inset-2 grid grid-rows-12 gap-8">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="w-full h-1 bg-gray-600" />
                ))}
              </div>
            </div>
            <div className="absolute inset-y-0 -right-4 w-8 bg-gray-800/50">
              <div className="absolute inset-0 bg-blue-200/10 animate-pulse" />
              <div className="absolute inset-2 grid grid-rows-12 gap-8">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="w-full h-1 bg-gray-600" />
                ))}
              </div>
            </div>
          </div>
  
          {/* タワークレーン */}
          <div className="absolute bottom-0 left-1/4 w-8 h-[450px]">
            <div className="relative w-full h-full bg-yellow-600">
              {/* クレーンの手すり */}
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-4 h-2 bg-yellow-500"
                  style={{ top: `${i * 30}px`, left: i % 2 ? '100%' : '-50%' }}
                />
              ))}
            </div>
            <div className="absolute top-8 left-1/2 w-96 h-8 bg-yellow-600 origin-left -rotate-12">
              {/* ワイヤー */}
              <div className="absolute top-0 right-8 w-1 h-32 bg-gray-700 origin-top animate-pulse" />
            </div>
            <div className="absolute top-4 left-1/2 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
          </div>
  
          {/* 作業員 */}
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute bottom-16"
              style={{ left: `${200 + i * 300}px` }}
            >
              <div className="relative w-8 h-12">
                <div className="absolute bottom-0 w-full h-8 bg-blue-500" />
                <div className="absolute top-0 w-6 h-6 bg-yellow-400 rounded-md animate-bounce" />
              </div>
            </div>
          ))}
  
          {/* 重機類 */}
          <div className="absolute bottom-0 right-1/4">
            <div className="relative w-48 h-32">
              <div className="absolute bottom-0 w-32 h-16 bg-yellow-800">
                {/* キャタピラ */}
                <div className="absolute bottom-0 w-full h-4 flex">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex-1 h-full border-r border-yellow-900" />
                  ))}
                </div>
              </div>
              <div className="absolute bottom-16 left-16 w-24 h-4 bg-yellow-800 origin-left -rotate-45 animate-pulse" />
              <div className="absolute bottom-16 left-36 w-16 h-4 bg-yellow-800 origin-left rotate-45">
                <div className="absolute right-0 w-8 h-12 bg-yellow-800 rotate-45" />
              </div>
            </div>
          </div>
  
          {/* 建設資材とコーン */}
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute bottom-16"
              style={{ left: `${150 + i * 200}px` }}
            >
              {/* 工事用コーン */}
              <div className="absolute -left-8 bottom-0 w-4 h-8 bg-orange-500">
                <div className="absolute top-0 w-full h-1 bg-white animate-pulse" />
              </div>
              {/* 鉄骨パイプ */}
              <div className="w-32 h-16">
                {[...Array(4)].map((_, j) => (
                  <div
                    key={j}
                    className="absolute w-full h-3 bg-gray-400"
                    style={{ 
                      bottom: `${j * 4}px`,
                      transform: `rotate(${j % 2 ? 3 : -3}deg)`
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
  
        {/* 作業灯の光と粉塵効果 */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 70}%`,
              width: '3px',
              height: '3px',
              backgroundColor: i % 2 ? '#FFD700' : '#FFFFFF',
              opacity: 0.3,
              animation: `blink ${1.5 + Math.random()}s infinite`
            }}
          />
        ))}
  
        {/* 水たまりと反射光 */}
        <div className="absolute bottom-0 w-full">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute bottom-2 h-6 bg-blue-900/15 blur-sm"
              style={{ 
                left: `${Math.random() * 100}%`,
                width: `${60 + Math.random() * 120}px`,
                animation: 'ripple 3s infinite'
              }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  

// 六本木ヒルズの背景
const RoppongiHillsBackground = ({ position }) => {
  return (
    <div
      className="absolute bottom-24"
      style={{ left: `${position}px`, zIndex: 5 }}
    >
      <div className="relative w-screen">
        {/* 六本木ヒルズ */}
        <div className="absolute bottom-0 left-[20%] transform -translate-x-1/2">
          <div className="relative w-[250px] h-[500px]">
            <div className="absolute bottom-0 w-full h-full bg-slate-800 rounded-t-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900" />
              <div className="absolute inset-4 grid grid-cols-10 gap-1">
                {[...Array(150)].map((_, i) => (
                  <div
                    key={i}
                    className="relative w-full h-2 bg-gradient-to-r from-yellow-100/20 to-blue-100/20"
                  >
                    <div
                      className="absolute inset-0 bg-yellow-200/10 animate-pulse"
                      style={{ animationDelay: `${Math.random() * 5}s` }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 東京スカイツリー */}
        <div className="absolute bottom-0 right-[30%]">
          <div className="relative w-[120px] h-[600px]">
            <div className="absolute bottom-0 w-full h-full bg-gradient-to-t from-gray-400 to-gray-300">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 100%)",
                  clipPath: "polygon(30% 0, 70% 0, 100% 100%, 0 100%)",
                }}
              />
              <div className="absolute top-[30%] left-1/2 transform -translate-x-1/2 w-[100px] h-[40px] bg-sky-200/30 rounded-lg">
                <div className="absolute inset-1 bg-sky-100/20 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* イルミネーションの木 */}
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute bottom-0"
            style={{
              left: `${25 + i * 20}%`,
              transform: `translateX(-50%)`,
            }}
          >
            <div className="relative w-[60px] h-[100px]">
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-20 bg-gray-800" />
              <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-24 h-32 bg-green-900 rounded-full">
                {[...Array(15)].map((_, j) => (
                  <div
                    key={j}
                    className="absolute w-2 h-2 rounded-full animate-twinkle"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      backgroundColor: ["#FFD700", "#00FFFF", "#FF69B4"][
                        j % 3
                      ],
                      animationDelay: `${Math.random() * 2}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* 夜空のグラデーション */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900 via-purple-900/80 to-transparent pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 50}%`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

//転入
const TransferExamBackground = ({ position }) => (
  <div
    className="absolute bottom-24"
    style={{ left: `${position}px`, zIndex: 5 }}
  >
    <div className="relative w-screen">
      {/* メイン図書館 */}
      <div className="absolute bottom-0 left-0 w-full flex justify-center space-x-12">
        {/* 図書館メイン建物 */}
        <div className="relative w-[300px] h-[200px]">
          <div className="absolute bottom-0 w-full h-full bg-amber-100 rounded-lg shadow-md">
            {/* 窓のグリッド */}
            <div className="absolute inset-4 grid grid-cols-8 gap-2">
              {[...Array(32)].map((_, i) => (
                <div
                  key={i}
                  className="w-full h-3 bg-amber-900/80 rounded shadow-inner"
                />
              ))}
            </div>

            {/* エントランス */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-12 bg-amber-200 rounded-b-lg shadow-md">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-8 bg-amber-300 shadow-inner" />
            </div>
          </div>

          {/* 図書館のサイン */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
            <div className="px-4 py-1 bg-amber-700 text-amber-100 text-sm font-bold rounded shadow-md">
              市立図書館
            </div>
          </div>
        </div>

        {/* 噴水 */}
        <div className="relative w-48 h-48">
          {/* 噴水台 */}
          <div className="absolute bottom-0 w-full h-8 bg-gray-700 rounded-t-md shadow-md" />
          {/* 水の柱 */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-4 h-16 bg-blue-400 rounded animate-fountain" />
          {/* 水滴のアニメーション */}
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-blue-300 rounded-full animate-drop"
              style={{
                left: `${45 + Math.random() * 10}%`,
                top: `${Math.random() * 20}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* 光のエフェクト */}
      <div className="absolute inset-0 bg-gradient-to-b from-orange-500/20 via-amber-300/10 to-transparent pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 50}%`,
              width: '2px',
              height: '2px',
              backgroundColor: '#FFD700',
              opacity: 0.3,
              animation: `blink ${1 + Math.random()}s infinite`,
            }}
          />
        ))}
      </div>

      {/* 光の反射 */}
      <div className="absolute bottom-0 w-full">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute bottom-4 h-6 bg-orange-200/10 blur-sm"
            style={{
              left: `${10 + i * 15}%`,
              width: '30px',
              animation: 'ripple 3s infinite',
            }}
          />
        ))}
      </div>
    </div>

    {/* スタイル定義 */}
    <style jsx>{`
      @keyframes blink {
        0%, 100% { opacity: 0.2; }
        50% { opacity: 0.6; }
      }
      @keyframes fountain {
        0%, 100% { height: 16px; }
        50% { height: 24px; }
      }
      @keyframes drop {
        0% { transform: translateY(0); opacity: 1; }
        100% { transform: translateY(50px); opacity: 0; }
      }
    `}</style>
  </div>
);


// 大学（背景用）
const UniversityBackground = ({ position }) => (
  <div
    className="absolute bottom-24"
    style={{
      left: `${position}px`,
      zIndex: 5,
    }}
  >
    <div className="relative w-screen">
      {/* メインの建物 */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[800px] h-[400px]">
        {/* 建物本体 */}
        <div className="absolute bottom-0 w-full h-full bg-[#b04a3a]">
          {/* レンガ模様 */}
          <div className="absolute inset-0 grid grid-cols-20 grid-rows-12 gap-px opacity-10">
            {[...Array(240)].map((_, i) => (
              <div key={i} className="bg-black" />
            ))}
          </div>

          {/* メインの窓グリッド */}
          <div className="absolute inset-8 grid grid-cols-8 grid-rows-6 gap-4">
            {[...Array(48)].map((_, i) => (
              <div key={i} className="relative w-full h-full">
                <div className="absolute inset-0 bg-white bg-opacity-70" />
                <div className="absolute inset-0 grid grid-cols-2">
                  <div className="border-r border-gray-400" />
                </div>
              </div>
            ))}
          </div>

          {/* 中央部分 */}
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-56 h-32">
            <div className="absolute top-0 w-full h-full bg-gray-200 opacity-80" />
            <div className="absolute bottom-4 w-full text-center text-gray-700 font-bold text-2xl">
              UNIVERSITY
            </div>
          </div>

          {/* 階段部分 */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-48">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-full h-2 bg-gray-300"
                style={{
                  transform: `translateY(-${i * 2}px)`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Clip triangle for roof effect
const styles = `
  .clip-triangle {
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  }
`;



    
  
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



  const SmallOffice = ({ position }) => (
    <div 
      className="absolute bottom-24"
      style={{ left: `${position}px` }}
    >
      {/* メインビル */}
      <div className="relative w-64 h-64">
        {/* 建物本体 */}
        <div className="absolute bottom-0 w-64 h-56 bg-gray-300 rounded-t-lg shadow-lg">
          {/* ウィンドウグリッド */}
          <div className="grid grid-cols-4 gap-2 p-2 h-full">
            {[...Array(16)].map((_, i) => (
              <div key={i} className="w-full h-6 bg-gray-200 rounded-sm shadow-inner" />
            ))}
          </div>
          
          {/* Life is Tech! ロゴエリア */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded shadow">
            <div className="text-sm font-bold text-blue-600">Life is Tech!</div>
            <div className="text-xs text-gray-600">大阪校</div>
          </div>
        </div>
  
        {/* エントランス */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-12 bg-gray-400 rounded-t-lg">
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-8 bg-gray-200 rounded" />
        </div>
  
        {/* ローソン */}
        <div className="absolute bottom-0 left-0 w-32 h-16 bg-white rounded-tr-lg shadow-lg">
          <div className="absolute top-2 left-2 w-28 h-6 bg-blue-600 rounded flex items-center justify-center">
            <div className="text-white text-sm font-bold">LAWSON</div>
          </div>
          <div className="absolute bottom-2 left-2 w-28 h-6 bg-blue-100" />
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
    // 風を定期的に発生させる
    const windInterval = setInterval(() => {
      setIsWindBlowing(true);
      setTimeout(() => {
        setIsHoodOn(false);
        setTimeout(() => {
          setIsWindBlowing(false);
          // フードをリセット（次の風のために）
          setTimeout(() => {
            setIsHoodOn(true);
          }, 1000);
        }, 1000);
      }, 500);
    }, 40000);  // 40秒ごとに風が吹くように変更
  
    return () => clearInterval(windInterval);
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
    if (currentScene === 2) {
      setIsPausedForKneeling(true); // しゃがみ込みを開始
      setIsWalking(false); // 歩行を停止
  
      const timer = setTimeout(() => {
        setIsPausedForKneeling(false); // しゃがみ込み終了
        setIsWalking(true); // 再び歩行開始
      }, 5000); // 5秒間停止
  
      return () => clearTimeout(timer); // クリーンアップ
    }
  }, [currentScene]);
  
  
  
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
            <Mentors position={window.innerWidth * 0.5 + backgroundPosition + 100} />
            {/* メンターたちの会話 */}
            <ChatBubble 
              text="3年間お疲れ!卒業おめでとう!!"
              position={window.innerWidth * 0.5 + backgroundPosition + 20} 
              isLeft={true}
              offsetY={30}
            />
            {/* 主人公の会話 */}
            <ChatBubble 
              text="大学合格してメンターとして帰ってきます！"
              position={position} 
              isLeft={false}
              offsetY={30}
              offsetX={-20}
            />
          </>
        )}

        {/* 受験失敗シーン */}
        {currentScene === 1 && (
          <>
   <ConstructionSiteBackground position={window.innerWidth * 0.5 + backgroundPosition} />
          <ChatBubble 
            text="憧れのメンターさんと同じ大学に絶対に行く！"
            position={position} 
            isLeft={false}
            offsetY={30}
          />
           </>
        )}

        {/* 転入学試験シーン */}
        {currentScene === 2 && (
  <>
  <TransferExamBackground position={window.innerWidth * 0.5 + backgroundPosition} />
    {/* 認定証の降下 */}
    {isPausedForKneeling && (
  <Certification characterPosition={position} />
)}

    {/* しゃがみ込む動作 */}
    {isPausedForKneeling ? (
      <div
        className="absolute bottom-24 transition-transform duration-300"
        style={{
          left: `${position}px`,
          transform: "translateY(10px)", // しゃがむ動作
          zIndex: 20,
        }}
      >
        <div className="relative w-8 h-16">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-yellow-100" />
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-8 h-6 bg-gray-800" />
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-4 bg-blue-900" />
        </div>
      </div>
    ) : (
      <ChatBubble 
        text="プログラミングで学習効率を上げるツールを開発してみよう！"
        position={position} 
        isLeft={false}
        offsetY={30}
      />
    )}
  </>
)}
        {/* メンター再会シーン */}
        {currentScene === 3 && (
          <>
              <UniversityBackground position={window.innerWidth * 0.5 + backgroundPosition - 100} />
            {isMeetingPaused && (
              <>
                <Mentors position={position + 30} />
                <ChatBubble 
                  text="認定証ずっと玄関に飾ってます笑"
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
     <RoppongiHillsBackground position={window.innerWidth * 0.5 + backgroundPosition} />
    <ChatBubble 
      text="メンターとしてメンバーを支えられる技術力やコミュニケーション力を身につける！"
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
            <NewMentors position={window.innerWidth * 0.5 + backgroundPosition + 100} />
            <SupportingMembers position={position} />
            <Mentors position={position - 40} />
            <ChatBubble 
              text="今度は僕が次代のエンジニアたちを支えたい！"
              position={position} 
              isLeft={false}
              offsetY={30}
            />
            <ChatBubble 
              text="モノづくりの楽しさを一緒に伝えよう！"
              position={window.innerWidth * 0.5 + backgroundPosition + 30} 
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
          @keyframes kneeling {
  0% { transform: translateY(0); }
  100% { transform: translateY(10px); } /* しゃがみ込む */
}

@keyframes standing {
  0% { transform: translateY(10px); }
  100% { transform: translateY(0); } /* 立ち上がる */
}




          @keyframes falling {
  0% { transform: translateY(-50px) rotate(0deg); opacity: 1; }
  100% { transform: translateY(500px) rotate(360deg); opacity: 0; }
}

        .animate-windBlow {
          animation: hood-blow-off 0.5s forwards;
        }
        @keyframes hood-blow-off {
          0% { transform: translateX(0) rotate(0deg); }
          100% { transform: translateX(50px) rotate(20deg); opacity: 0; }
        }

        @keyframes kneeling {
  0% { transform: translateY(0); }
  100% { transform: translateY(10px); }
}

@keyframes standing {
  0% { transform: translateY(10px); }
  100% { transform: translateY(0); }
}
  @keyframes falling {
  0% {
    transform: translateY(-100px) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(500px) rotate(360deg);
    opacity: 0;
  }
}

.falling-effect {
  animation: falling 3s ease-out infinite;
}

@keyframes certFall {
  0% {
    transform: translateY(-50px);
    opacity: 0;
  }
  100% {
    transform: translateY(400px); /* 最終的な位置 */
    opacity: 1;
  }
}

@keyframes certFall {
  0% {
    transform: translateY(-50px);
    opacity: 0;
  }
  100% {
    transform: translateY(400px); /* 最終的な位置 */
    opacity: 1;
  }
}

  @keyframes twinkle {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
  .animate-twinkle {
    animation: twinkle 2s infinite ease-in-out;
  }

  @keyframes blink {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.8; }
  }
  @keyframes ripple {
    0%, 100% { transform: scale(1); opacity: 0.1; }
    50% { transform: scale(1.05); opacity: 0.15; }
  }


        @keyframes blink {
          0%, 100% { opacity: 0.3; }
          50% { transform: scale(1.2); opacity: 0.6; }
        }
        @keyframes ripple {
          0%, 100% { transform: scale(1); opacity: 0.15; }
          50% { transform: scale(1.1); opacity: 0.2; }
        }


              @keyframes blink {
        0%, 100% { opacity: 0.4; }
        50% { opacity: 0.8; }
      }
      @keyframes ripple {
        0%, 100% { transform: scale(1); opacity: 0.1; }
        50% { transform: scale(1.05); opacity: 0.15; }
      }



      `}</style>
    </div>
  );
};

export default WalkingCharacter;