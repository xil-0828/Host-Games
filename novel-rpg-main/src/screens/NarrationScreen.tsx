
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { useRef, useCallback } from "react";
import { MarkdownTypewriterHooks } from "react-markdown-typewriter";
import { useQueryCanGoBack, useQueryCanGoNext, useQueryDialogue } from "../hooks/useQueryInterface";
import ChoiceMenu from "./ChoiceMenu";

export default function NarrationScreen() {
  const {
    data: { text, animatedText, character } = {},
  } = useQueryDialogue();
  const { data: canGoNext = false } = useQueryCanGoNext();
  const { data: canGoBack = false } = useQueryCanGoBack();

  const paragraphRef = useRef<HTMLDivElement>(null);

  // 一文字ごとにスクロール
  const handleCharacterAnimationComplete = useCallback((ref: { current: HTMLSpanElement | null }) => {
    if (paragraphRef.current && ref.current) {
      const scrollTop = ref.current.offsetTop - paragraphRef.current.clientHeight / 2;
      paragraphRef.current.scrollTo({ top: scrollTop, behavior: "auto" });
    }
  }, []);

  // PixiVNがanimatedTextを提供しない場合、textを代わりにアニメーション対象にする
  const displayAnimatedText = animatedText ?? text ?? "";

  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
      }}
    >
      <div style={{ flex: 1, minHeight: 0 }}>
        <ChoiceMenu />
      </div>

      {(text || animatedText) && (
        <div
          style={{
            flex: "0 0 auto",
            height: "30%",
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* キャラ名 */}
          {character?.name && (
            <b style={{ padding: "4px 12px", fontSize: "1.1rem" }}>
              {`${character.name || ""} ${character.surname || ""}`}
            </b>
          )}

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              height: "100%",
              overflow: "hidden",
              marginRight: canGoNext || canGoBack ? "40px" : undefined,
            }}
          >
            {/* 立ち絵 */}
            {character?.icon && (
              <img
                src={character.icon}
                loading="lazy"
                alt=""
                style={{
                  maxWidth: "28%",
                  height: "auto",
                  objectFit: "contain",
                  display: "block",
                  marginLeft: "8px",
                }}
              />
            )}

            {/* テキストエリア */}
            <div
              ref={paragraphRef}
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "8px 12px",
                fontSize: "1rem",
                lineHeight: 1.6,
              }}
            >
              <MarkdownTypewriterHooks
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                delay={10} // ← ここで文字速度調整 (ms)
                motionProps={{
                  onCharacterAnimationComplete: handleCharacterAnimationComplete,
                }}
              >
                {displayAnimatedText}
              </MarkdownTypewriterHooks>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
