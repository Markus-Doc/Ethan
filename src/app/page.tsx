import Chapter0Hero from '@/components/Chapters/Chapter0_Hero'
import Chapter1Open from '@/components/Chapters/Chapter1_Open'
import Chapter2About from '@/components/Chapters/Chapter2_About'
import Chapter3Services from '@/components/Chapters/Chapter3_Services'
import Chapter4Process from '@/components/Chapters/Chapter4_Process'
import Chapter5Workshops from '@/components/Chapters/Chapter5_Workshops'
import Chapter6Contact from '@/components/Chapters/Chapter6_Contact'

export default function Home() {
  return (
    <main>
      <Chapter0Hero />
      <Chapter1Open />
      <Chapter2About />
      <Chapter3Services />
      <Chapter4Process />
      <Chapter5Workshops />
      <Chapter6Contact />
    </main>
  )
}
