import { useState } from 'react';

export default function Accordion({ items }) {
  const [openId, setOpenId] = useState(null);
  return (
    <div className="accordion">
      {items.map((f) => {
        const open = openId === f.id;
        return (
          <div key={f.id} className={`accordion__item ${open ? 'is-open' : ''}`}>
            <h3>
              <button
                aria-expanded={open}
                aria-controls={`faq-${f.id}`}
                onClick={() => setOpenId(open ? null : f.id)}
              >
                {f.question}
                <span aria-hidden="true">{open ? '-' : '+'}</span>
              </button>
            </h3>
            {open && (
              <div id={`faq-${f.id}`} className="accordion__panel">
                <p>{f.answer}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
