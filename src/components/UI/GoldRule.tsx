import React from 'react'
import styles from './GoldRule.module.css'

interface Props {
  className?: string
  width?: string
}

export default function GoldRule({ className = '', width = '80%' }: Props) {
  return (
    <div
      className={`${styles.rule} ${className}`}
      style={{ width }}
      role="separator"
    />
  )
}
