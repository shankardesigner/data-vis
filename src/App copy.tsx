import { useEffect, useState } from 'react'
import * as d3 from 'd3'
import { NodeType, LinkType, Attribute } from './types'

const App = () => {
  const [nodes, setNodes] = useState<NodeType[]>([])
  const [links, setLinks] = useState<LinkType[]>([])
  const [attributes, setAttributes] = useState<Record<number, Attribute>>({})

  useEffect(() => {
    async function loadData() {
      const data = await d3.csv('src/data/attributes.csv')
      const nodesData = await d3.json('src/data/Nodes-1.json') as NodeType[]
      const linksData = await d3.json('src/data/links.json') as LinkType[]
      const parsedData: Record<number, Attribute> = {}
      
      data.forEach((d: any) => {
        if (d.id) {
          parsedData[+d.id] = {
            id: +d.id,
            ...d,
          }
        }
      })

      setNodes(nodesData)
      setLinks(linksData)
      setAttributes(parsedData)
    }

    loadData()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-indigo-600">
        Healthcare Patient Interaction Network
      </h1>
      <NetworkGraph nodes={nodes} links={links} attributes={attributes} />
    </div>
  )
}

export default App
