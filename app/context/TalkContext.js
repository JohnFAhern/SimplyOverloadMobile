import React, { createContext } from 'react'

const TalkContext = createContext(null)

export function TalkProvider({children}) {
    
    const greet = (name) => {
        console.log(`Hello ${name}!`)
    }


  return (
    <TalkContext.Provider value={{ greet }}>
        {children}
    </TalkContext.Provider>
  )
}

export default TalkContext
