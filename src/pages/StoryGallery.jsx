import React from 'react'
import { Link } from 'react-router-dom'

const SAMPLE = [
  { id: 'world-hunger', title: 'World Hunger', kind: 'good', blurb: 'Global hunger declined over centuries.'},
  { id: 'income-inequality', title: 'US CEO vs Average Pay', kind: 'bad', blurb: 'CEO pay rose much faster than average wages.'}
]

export default function StoryGallery({ kind }){
  const items = SAMPLE.filter(s => !kind || s.kind===kind)
  return (
    <section>
      <h2>{kind === 'bad' ? 'Bad' : (kind === 'good' ? 'Good' : 'Stories')}</h2>
      <ul className="story-list">
        {items.map(it => (
          <li key={it.id} className={`story-item ${it.kind}`}>
            <h3><Link to={`/story/${it.id}`}>{it.title}</Link></h3>
            <p>{it.blurb}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
