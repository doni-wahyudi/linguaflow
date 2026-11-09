/**
 * @file FuriganaText.jsx
 * @description Accessible reading helper rendering Japanese text with HTML5 <ruby> and <rt>
 * Furigana annotations and optional Romaji transcription. Supports bracket notation [漢字]{かんじ}
 * or structured furigana mapping arrays.
 */

import React, { useMemo } from 'react';

/**
 * Parses text into an array of plain strings and { kanji, rt } segments.
 *
 * @param {string} text
 * @param {Array<{ kanji: string, rt: string }>} [furiganaList]
 * @returns {Array<{ type: 'ruby'|'text', value: string, rt?: string }>}
 */
function parseRubySegments(text, furiganaList = []) {
  if (!text) return [];

  // Check for bracket syntax: [漢字]{かんじ}
  const bracketRegex = /\[([^\]]+)\]\{([^}]+)\}/g;
  if (bracketRegex.test(text)) {
    const segments = [];
    let lastIndex = 0;
    bracketRegex.lastIndex = 0;
    let match;

    while ((match = bracketRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        segments.push({ type: 'text', value: text.slice(lastIndex, match.index) });
      }
      segments.push({ type: 'ruby', value: match[1], rt: match[2] });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      segments.push({ type: 'text', value: text.slice(lastIndex) });
    }
    return segments;
  }

  // Check structured furigana array if provided
  if (Array.isArray(furiganaList) && furiganaList.length > 0) {
    // Sort kanji by length descending to avoid partial matches
    const sorted = [...furiganaList].sort((a, b) => b.kanji.length - a.kanji.length);
    const escaped = sorted.map((item) => item.kanji.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const pattern = new RegExp(`(${escaped.join('|')})`, 'g');

    const lookup = new Map(sorted.map((item) => [item.kanji, item.rt]));
    const segments = [];
    let lastIdx = 0;
    let m;

    while ((m = pattern.exec(text)) !== null) {
      if (m.index > lastIdx) {
        segments.push({ type: 'text', value: text.slice(lastIdx, m.index) });
      }
      const matchedKanji = m[1];
      segments.push({
        type: 'ruby',
        value: matchedKanji,
        rt: lookup.get(matchedKanji) || '',
      });
      lastIdx = m.index + matchedKanji.length;
    }

    if (lastIdx < text.length) {
      segments.push({ type: 'text', value: text.slice(lastIdx) });
    }
    return segments;
  }

  // Default: Plain text
  return [{ type: 'text', value: text }];
}

/**
 * FuriganaText component with accessible ruby annotations.
 *
 * @param {object} props
 * @param {string} props.text - The Japanese text to display.
 * @param {string} [props.reading] - Fallback kana reading.
 * @param {Array<{ kanji: string, rt: string }>} [props.furigana] - Mapping of kanji to readings.
 * @param {string} [props.romaji] - Romaji transcription.
 * @param {boolean} [props.showFurigana=true] - Whether to render furigana ruby annotations.
 * @param {boolean} [props.showRomaji=false] - Whether to render romaji subtext.
 * @param {string} [props.className=''] - Wrapper CSS classes.
 * @param {string} [props.rubyClassName=''] - Custom classes for <rt> tags.
 * @returns {JSX.Element}
 */
export default function FuriganaText({
  text = '',
  reading = '',
  furigana = [],
  romaji = '',
  showFurigana = true,
  showRomaji = false,
  className = '',
  rubyClassName = '',
}) {
  const segments = useMemo(() => {
    return parseRubySegments(text, furigana);
  }, [text, furigana]);

  const hasRuby = segments.some((s) => s.type === 'ruby');

  return (
    <span className={`inline-flex flex-col align-middle ${className}`}>
      <span className="inline-block leading-loose" lang="ja">
        {hasRuby ? (
          segments.map((seg, idx) => {
            if (seg.type === 'ruby') {
              return (
                <ruby key={idx} className="ruby">
                  {seg.value}
                  {showFurigana && seg.rt && (
                    <rt
                      className={`text-[11px] font-medium text-brand-600 select-none ${rubyClassName}`}
                      aria-hidden="true"
                    >
                      {seg.rt}
                    </rt>
                  )}
                </ruby>
              );
            }
            return <React.Fragment key={idx}>{seg.value}</React.Fragment>;
          })
        ) : reading && reading !== text && showFurigana ? (
          <ruby className="ruby">
            {text}
            <rt
              className={`text-[11px] font-medium text-brand-600 select-none ${rubyClassName}`}
              aria-hidden="true"
            >
              {reading}
            </rt>
          </ruby>
        ) : (
          text
        )}
      </span>

      {showRomaji && romaji && (
        <span
          className="text-xs font-mono text-ink-500 font-normal tracking-wide select-text mt-0.5"
          aria-label={`Romaji reading: ${romaji}`}
        >
          {romaji}
        </span>
      )}
    </span>
  );
}
