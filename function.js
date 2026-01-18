// timeline
const tl = gsap.timeline();

/* -----------------------
   1. circles ripple
   表現: 初回ロード時に、5つの円が中心から外へ水滴が落ちるように
        バラバラのタイミングで半径が広がるアニメーション
   実装: 各円の半径(r属性)を0からdata-r属性の値まで
        Math.random()でランダムな開始時刻を設定
----------------------- */

const circles = document.querySelectorAll(".circle");

circles.forEach((circle) => {
    tl.to(circle, {
        attr: { r: circle.dataset.r },
        duration: 1.4,
        ease: "power2.out",
    }, Math.random() * 0.6); // ← バラバラの開始タイミング
});

/* -----------------------
   2. title fade in
   表現: 円が広がった後、「メディアデザイン演習」と「人生の転機」の
        テキストがぼかしが取れながらフェードイン
   実装: .title要素のopacityを0→1へ、filterのblurを50px→0pxへ
----------------------- */

tl.to(".title", {
    opacity: 1,
    filter: "blur(0px)",
    duration: 1.2,
    ease: "power2.out",
}, "+=0.4");

/* -----------------------
   3. glow dots random pulse
   表現: 円の交点に配置した14個のぼかしの点が、
        ランダムに2つずつ明滅（ぽわぽわと光る）し続ける
   実装: 全ての点をopacity: 0にした後、
        ランダムに選ばれた2つの点のみopacity: 1にして光らせる
        この処理を700msごとに繰り返す
        重複しないようにdo-whileで選別している
----------------------- */

const dots = document.querySelectorAll(".glow-dot");

function glowRandom() {
    console.log("glowRandom called");
    // すべての点をフェードアウト
    dots.forEach(dot => {
        gsap.to(dot, {
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
        });
    });

    // ランダムに2つの点を選ぶ（重複なし）
    const targets = [];
    for (let i = 0; i < 2; i++) {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * dots.length);
        } while (targets.includes(randomIndex));
        targets.push(randomIndex);
    }

    console.log("targets:", targets);

    // 選ばれた2つの点をフェードイン
    targets.forEach(index => {
        gsap.to(dots[index], {
            opacity: 1,
            duration: 0.8,
            ease: "power2.out"
        });
    });
}

// タイトル表示後に開始
tl.call(() => {
    setInterval(glowRandom, 700);
});

/* -----------------------
   4. Scroll animations
   表現: スクロールに応じて各セクションのアニメーションが発動
   実装: ScrollTriggerプラグインを使用してスクロール位置を監視
----------------------- */

// ScrollTrigger登録
gsap.registerPlugin(ScrollTrigger);

/* -----------------------
   4-1. Personal Title Section - らせんパスの成長
   表現: スクロールすると、3本のらせん構造（white線）が
        ページの左から右へ徐々に伸びる（stroke-dasharrayが増加）
   実装: stroke-dasharrayを0→2000へアニメーション
        scrub: trueでスクロール連動
        ページ内に留まるセクション
----------------------- */

const spirals = document.querySelectorAll(".spiral-path");
spirals.forEach((spiral, index) => {
    gsap.to(spiral, {
        strokeDasharray: 2000,
        duration: 2,
        ease: "none",
        scrollTrigger: {
            trigger: ".personal-title-section",
            start: "top bottom",
            end: "bottom top",
            scrub: true,  // スクロールに連動してアニメーション
        }
    });
});

/* -----------------------
   4-2. Personal Title Section - タイトルテキストフェードイン
   表現: らせんが最後まで伸びきったら、
        英語タイトル「Though Uncertainry」と
        日本語サブタイトルがフェードイン
   実装: .title-contentのopacityを0→1へ
        セクション下部到達時にトリガー
----------------------- */

gsap.to(".title-content", {
    opacity: 1,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
        trigger: ".personal-title-section",
        start: "bottom top",
        end: "bottom center",
        scrub: false,
        onEnter: () => gsap.to(".title-content", { opacity: 1 }),
        onLeaveBack: () => gsap.to(".title-content", { opacity: 0 }),
    }
});

/* -----------------------
   4-3. Intro Section - セクションタイトルフェードイン
   表現: Introセクションに到達したら、
        「Intro」というテキストがフェードイン
   実装: .intro-titleのopacityを0→1へ
        スクロールトリガーで発動（スクロールしない）
----------------------- */

gsap.to(".intro-title", {
    opacity: 1,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
        trigger: ".intro-section",
        start: "top 30%",
    }
});

/* -----------------------
   4-4. Intro Section - 本文テキスト段落フェードイン
   表現: Introのタイトル後、4つの段落テキストが
        順番（0.4秒間隔）にフェードイン
   実装: .intro-textのopacityを0→1へ
        stagger: 0.4で0.4秒ずつ順番に開始
----------------------- */

gsap.to(".intro-text", {
    opacity: 1,
    duration: 1,
    ease: "power2.out",
    stagger: 0.4,  // 各要素を0.4秒ずつ遅延させる
    scrollTrigger: {
        trigger: ".intro-section",
        start: "top 30%",
    }
});

/* -----------------------
   5. Profile Section Animations
   表現: Profileセクションで豊さんと楓の紹介を表示
        枠線→名前→紹介文の順番でアニメーション
----------------------- */

/* -----------------------
   5-1. Profile Title フェードイン
   表現: Profileセクションの「profile」テキストが
        ページ中央でフェードイン表示
   実装: .profile-titleのopacityを0→1へ
----------------------- */

gsap.to(".profile-title", {
    opacity: 1,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
        trigger: ".profile-section",
        start: "top 30%",
    }
});

/* -----------------------
   5-2. Profile Cards - 枠線を時計回りに描く
   表現: 2つのプロフィールカード（豊さん、楓）の
        角丸い四角形の枠線がゼロから描かれていく
        左から見て時計回りの描画順で表現
   実装: stroke-dashoffsetを1600→0へアニメーション
        各カード間を0.5秒ずつずらす（stagger）
        stroke-dasharrayで2000に設定済み
----------------------- */

gsap.to(".border-path, .border-rect", {
    strokeDashoffset: 0,
    duration: 2,
    ease: "power2.inOut",
    stagger: 0.5,  // 各カードを0.5秒ずつずらす
    scrollTrigger: {
        trigger: ".profile-cards",
        start: "top 30%",
    }
});

/* -----------------------
   5-3. Profile Cards - 名前テキストフェードイン
   表現: 枠線が描き終わった後、
        「豊さん」と「楓」の名前がフェードイン表示
   実装: setTimeout()で3秒後（枠線描画終了後）に実行
        .profile-nameのopacityを0→1へ
        各カード間を0.5秒ずつずらす
----------------------- */

setTimeout(() => {
    gsap.to(".profile-name", {
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.5,
        scrollTrigger: {
            trigger: ".profile-cards",
            start: "top 30%",
        }
    });
}, 2000);  // 2秒後に実行（枠線描画: 2秒 + 少しの余裕）

/* -----------------------
   5-4. Profile Cards - 紹介文テキストフェードイン
   表現: 名前が表示された後、各プロフィール紹介文が
        フェードイン表示
   実装: setTimeout()で3.2秒後（枠線2秒+名前表示後）に実行
        .profile-textのopacityを0→1へ
        各カード間を0.5秒ずつずらす
----------------------- */

setTimeout(() => {
    gsap.to(".profile-text", {
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        stagger: 0.5,
        scrollTrigger: {
            trigger: ".profile-cards",
            start: "top 30%",
        }
    });
}, 3200);  // 3.2秒後に実行（枠線2秒 + 名前0.8秒表示 + 遅延0.4秒）

/* -----------------------
   6. Table of Contents Animations
   表現: 目次セクションでepisode1～4と「Your Next Step」
        が段階的にフェードイン表示
   実装: ScrollTriggerを使用してセクション到達時に
        .toc-itemのopacityをアニメーション
----------------------- */

/* -----------------------
   6-1. TOC Items フェードイン
   表現: 目次セクションのスクロール時に、
        各エピソードのタイトル（episode1～4）と
        「Your Next Step」が順番にフェードイン
   実装: .toc-itemのopacityを0→1へ
        stagger: 0.4で0.4秒ずつ順番に開始
        セクション上部到達時に発動開始
----------------------- */

gsap.to(".toc-item", {
    opacity: 1,
    duration: 1,
    ease: "power2.out",
    stagger: 0.4,  // 各エピソードを0.4秒ずつずらして表示
    scrollTrigger: {
        trigger: ".toc-section",
        start: "top 30%",
    }
});

/* -----------------------
   7. Episode 1: Awakening Section Animations
   表現: Episode1セクションでタイトルと概要文が
        段階的にフェードイン表示
   実装: ScrollTriggerを使用してセクション到達時に
        アニメーション発動
----------------------- */

/* -----------------------
   7-1. Episode 1 Title フェードイン
   表現: Episode1セクションに到達したら、
        「episode1: Awakening」というタイトルがフェードイン
   実装: .episode1-titleのopacityを0→1へ
        スクロールトリガーで発動
----------------------- */

gsap.to(".episode1-title", {
    opacity: 1,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
        trigger: ".episode1-section",
        start: "top 30%",
    }
});

/* -----------------------
   7-2. Episode 1 Overview フェードイン
   表現: タイトル表示後、概要文がフェードイン表示
   実装: .episode1-overviewのopacityを0→1へ
        スクロールトリガーで発動
        タイトルとは異なるタイミングで表示開始
   その後: 概要文表示後、「ある人との別れ」の色を
           #ffffffから#2c6db6へ変化させる
----------------------- */

gsap.to(".episode1-overview", {
    opacity: 1,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
        trigger: ".episode1-section",
        start: "top 30%",
        onEnter: () => {
            // 概要文フェード完了後、「ある人との別れ」の色を変える
            gsap.to(".episode1-overview .highlight-phrase", {
                color: "#2c6db6",
                duration: 0.8,
                ease: "power2.out",
                delay: 1,  // 概要文フェードイン(1秒)の後に実行
            });
        }
    }
});

/* -----------------------
   8. Episode 1: Content Section Animations
   表現: Episode1の本文セクション（枠線と対談内容）の
        アニメーション制御
   実装: 枠線のアニメーション、キャラクターテキストの
        フェードイン、スクロール機能の管理
----------------------- */

/* -----------------------
   8. Episode 1: Content Section フェードイン
   表現: Episode1のラリーテキストがフェードインで表示
        その後、「祖母の死」の色が白から青に変化
   実装: ScrollTriggerでセクション到達時にラリーをフェードイン
        ラリーフェード完了後に「祖母の死」の色を変更
----------------------- */

gsap.to(".rally", {
    opacity: 1,
    duration: 1,
    ease: "power2.out",
    stagger: 0.3,  // 各ラリーを0.3秒ずつずらして表示
    scrollTrigger: {
        trigger: ".episode1-content-section",
        start: "top 30%",
        onEnter: () => {
            // ラリーフェード完了後、「祖母の死」の色を変える
            gsap.to(".rally .highlight-phrase", {
                color: "#2c6db6",
                duration: 0.8,
                ease: "power2.out",
                delay: 5,  // ラリーフェードイン完了後の後に実行
            });
            
            // Episode1のタイトルセクション内の「ある人との別れ」も同じく色を変える
            gsap.to(".episode1-overview .highlight-phrase", {
                color: "#2c6db6",
                duration: 0.8,
                ease: "power2.out",
                delay: 5,
            });
        }
    }
});

/* -----------------------
   9. Episode 2: Dilemma Section Animations
   表現: Episode2セクションでタイトルと概要文が
        段階的にフェードイン表示
   実装: ScrollTriggerを使用してセクション到達時に
        アニメーション発動
----------------------- */

/* -----------------------
   9-1. Episode 2 Title フェードイン
   表現: Episode2セクションに到達したら、
        「episode2: Dilemma」というタイトルがフェードイン
   実装: .episode2-titleのopacityを0→1へ
        スクロールトリガーで発動
----------------------- */

gsap.to(".episode2-title", {
    opacity: 1,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
        trigger: ".episode2-section",
        start: "top 30%",
    }
});

/* -----------------------
   9-2. Episode 2 Overview フェードイン
   表現: タイトル表示後、概要文がフェードイン表示
   実装: .episode2-overviewのopacityを0→1へ
        スクロールトリガーで発動
        タイトルとは異なるタイミングで表示開始
   その後: 概要文表示後、highlight-phraseの色を
           #ffffffから#2c6db6へ変化させる
----------------------- */

gsap.to(".episode2-overview", {
    opacity: 1,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
        trigger: ".episode2-section",
        start: "top 30%",
        onEnter: () => {
            // 概要文フェード完了後、highlight-phraseの色を変える
            gsap.to(".episode2-overview .highlight-phrase", {
                color: "#2c6db6",
                duration: 0.8,
                ease: "power2.out",
                delay: 1,  // 概要文フェードイン(1秒)の後に実行
            });
        }
    }
});

/* -----------------------
   10. Episode 2: Content Section Animations
   表現: Episode2のラリーテキストがフェードインで表示
        その後、highlight-phraseの色が白から青に変化
   実装: ScrollTriggerでセクション到達時にラリーをフェードイン
        ラリーフェード完了後にhighlight-phraseの色を変更
----------------------- */

gsap.to(".episode2-content-section .rally", {
    opacity: 1,
    duration: 1,
    ease: "power2.out",
    stagger: 0.3,  // 各ラリーを0.3秒ずつずらして表示
    scrollTrigger: {
        trigger: ".episode2-content-section",
        start: "top 30%",
        onEnter: () => {
            // ラリーフェード完了後、highlight-phraseの色を変える
            gsap.to(".episode2-content-section .highlight-phrase", {
                color: "#2c6db6",
                duration: 0.8,
                ease: "power2.out",
                delay: 5,  // ラリーフェードイン完了後に実行
            });
            
            // Episode2のタイトルセクション内のhighlight-phraseも同じく色を変える
            gsap.to(".episode2-overview .highlight-phrase", {
                color: "#2c6db6",
                duration: 0.8,
                ease: "power2.out",
                delay: 5,
            });
        }
    }
});

/* -----------------------
   11. Episode 3: Invitation Section Animations
   表現: Episode3セクションでタイトルと概要文が
        段階的にフェードイン表示
   実装: ScrollTriggerを使用してセクション到達時に
        アニメーション発動
----------------------- */

/* -----------------------
   11-1. Episode 3 Title フェードイン
   表現: Episode3セクションに到達したら、
        「episode3: Invitation」というタイトルがフェードイン
   実装: .episode3-titleのopacityを0→1へ
        スクロールトリガーで発動
----------------------- */

gsap.to(".episode3-title", {
    opacity: 1,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
        trigger: ".episode3-section",
        start: "top 30%",
    }
});

/* -----------------------
   11-2. Episode 3 Overview フェードイン
   表現: タイトル表示後、概要文がフェードイン表示
   実装: .episode3-overviewのopacityを0→1へ
        スクロールトリガーで発動
        タイトルとは異なるタイミングで表示開始
   その後: 概要文表示後、highlight-phraseの色を
           #ffffffから#2c6db6へ変化させる
----------------------- */

gsap.to(".episode3-overview", {
    opacity: 1,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
        trigger: ".episode3-section",
        start: "top 30%",
        onEnter: () => {
            // 概要文フェード完了後、highlight-phraseの色を変える
            gsap.to(".episode3-overview .highlight-phrase", {
                color: "#2c6db6",
                duration: 0.8,
                ease: "power2.out",
                delay: 1,  // 概要文フェードイン(1秒)の後に実行
            });
        }
    }
});

/* -----------------------
   12. Episode 3: Content Section Animations
   表現: Episode3のラリーテキストがフェードインで表示
        その後、highlight-phraseの色が白から青に変化
   実装: ScrollTriggerでセクション到達時にラリーをフェードイン
        ラリーフェード完了後にhighlight-phraseの色を変更
----------------------- */

gsap.to(".episode3-content-section .rally", {
    opacity: 1,
    duration: 1,
    ease: "power2.out",
    stagger: 0.3,  // 各ラリーを0.3秒ずつずらして表示
    scrollTrigger: {
        trigger: ".episode3-content-section",
        start: "top 30%",
        onEnter: () => {
            // ラリーフェード完了後、highlight-phraseの色を変える
            gsap.to(".episode3-content-section .highlight-phrase", {
                color: "#2c6db6",
                duration: 0.8,
                ease: "power2.out",
                delay: 5,  // ラリーフェードイン完了後に実行
            });
            
            // Episode3のタイトルセクション内のhighlight-phraseも同じく色を変える
            gsap.to(".episode3-overview .highlight-phrase", {
                color: "#2c6db6",
                duration: 0.8,
                ease: "power2.out",
                delay: 5,
            });
        }
    }
});

/* -----------------------
   13. Episode 4: Conviction Section Animations
   表現: Episode4セクションでタイトルと概要文が
        段階的にフェードイン表示
   実装: ScrollTriggerを使用してセクション到達時に
        アニメーション発動
----------------------- */

/* -----------------------
   13-1. Episode 4 Title フェードイン
   表現: Episode4セクションに到達したら、
        「episode4: Conviction」というタイトルがフェードイン
   実装: .episode4-titleのopacityを0→1へ
        スクロールトリガーで発動
----------------------- */

gsap.to(".episode4-title", {
    opacity: 1,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
        trigger: ".episode4-section",
        start: "top 30%",
    }
});

/* -----------------------
   13-2. Episode 4 Overview フェードイン
   表現: タイトル表示後、概要文がフェードイン表示
   実装: .episode4-overviewのopacityを0→1へ
        スクロールトリガーで発動
        タイトルとは異なるタイミングで表示開始
   その後: 概要文表示後、highlight-phraseの色を
           #ffffffから#2c6db6へ変化させる
----------------------- */

gsap.to(".episode4-overview", {
    opacity: 1,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
        trigger: ".episode4-section",
        start: "top 30%",
        onEnter: () => {
            // 概要文フェード完了後、highlight-phraseの色を変える
            gsap.to(".episode4-overview .highlight-phrase", {
                color: "#2c6db6",
                duration: 0.8,
                ease: "power2.out",
                delay: 1,  // 概要文フェードイン(1秒)の後に実行
            });
        }
    }
});

/* -----------------------
   14. Episode 4: Content Section Animations
   表現: Episode4のラリーテキストがフェードインで表示
        その後、highlight-phraseの色が白から青に変化
   実装: ScrollTriggerでセクション到達時にラリーをフェードイン
        ラリーフェード完了後にhighlight-phraseの色を変更
----------------------- */

gsap.to(".episode4-content-section .rally", {
    opacity: 1,
    duration: 1,
    ease: "power2.out",
    stagger: 0.3,  // 各ラリーを0.3秒ずつずらして表示
    scrollTrigger: {
        trigger: ".episode4-content-section",
        start: "top 30%",
        onEnter: () => {
            // ラリーフェード完了後、highlight-phraseの色を変える
            gsap.to(".episode4-content-section .highlight-phrase", {
                color: "#2c6db6",
                duration: 0.8,
                ease: "power2.out",
                delay: 5,  // ラリーフェードイン完了後に実行
            });
            
            // Episode4のタイトルセクション内のhighlight-phraseも同じく色を変える
            gsap.to(".episode4-overview .highlight-phrase", {
                color: "#2c6db6",
                duration: 0.8,
                ease: "power2.out",
                delay: 5,
            });
        }
    }
});
