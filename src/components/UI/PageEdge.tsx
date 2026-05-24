import React from 'react'
import styles from './PageEdge.module.css'

interface Props {
  side?: 'left' | 'right' | 'top' | 'bottom'
  className?: string
}

export default function PageEdge({ side = 'right', className = '' }: Props) {
  return <div className={`${styles.edge} ${styles[side]} ${className}`} />
}
