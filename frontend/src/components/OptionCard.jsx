/**
 * OptionCard.jsx
 * Reusable card component used across all selection grids.
 * Mirrors .option-card elements from calculator.html
 */
export default function OptionCard({ value, label, imgSrc, selected, onSelect }) {
  return (
    <div
      className={`option-card${selected ? ' selected' : ''}`}
      data-value={value}
      onClick={() => onSelect(value)}
    >
      {imgSrc && <img src={imgSrc} alt={label} />}
      <div
        className="label"
        style={!imgSrc ? { paddingTop: '20px', paddingBottom: '20px' } : {}}
      >
        {label}
      </div>
    </div>
  );
}
