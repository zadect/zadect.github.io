import React from 'react'
import { useParams } from 'react-router-dom'
import Chart from '../components/Chart'

const STORIES = {
  'world-hunger': { title: 'World Hunger', kind: 'good', dataFile: '/data/world-hunger.csv', sources: [] },
  'income-inequality': { title: 'US CEO vs Average Pay', kind: 'bad', dataFile: '/data/ceo-vs-average.csv', sources: [] }
}

export default function StoryPage(){
  const { id } = useParams()
  const story = STORIES[id]
  if(!story) return <p>Story not found</p>
  return (
    <article>
      <h2>{story.title}</h2>
      <p className="lead">Short insight goes here — keep it concise.</p>
      <Chart id={id} dataFile={story.dataFile} />
      <section className="sources">
        <h4>Sources</h4>
        <ul>
          {story.sources.length ? story.sources.map((s,i)=>(<li key={i}><a href={s.url} target="_blank" rel="noreferrer">{s.title}</a></li>)) : <li>Sources will be added with datasets.</li>}
        </ul>
      </section>
    </article>
  )
}
