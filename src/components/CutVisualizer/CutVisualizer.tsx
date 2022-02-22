import { lighten } from 'polished'
import { FC, useMemo } from 'react'

import { useScoreStore } from '../../store/score'
import { NoteBlock } from '../NoteBlock'
import { NoteBlockConfig } from '../NoteBlock/NoteBlock'
import classes from './CutVisualizer.module.scss'

export type CutVisualizerProps = {
  cellSize?: number
  gap?: number
  fadeTime?: number
  gridColor?: string
  gridBorderSize?: number
  style: any
}

const shadowColor = lighten(0.2)
const indicatorColor = lighten(0.75)
const cutColor = lighten(0.9)

export const CutVisualizer: FC<CutVisualizerProps> = ({
  cellSize = 50,
  fadeTime = 300,
  gridColor = 'transparent',
  gridBorderSize = 2,
  style,
  gap
}) => {
  const { noteCuts } = useScoreStore()

  const { noteConfig, notePadding }: { noteConfig: NoteBlockConfig; notePadding: number } = useMemo(
    () => ({
      noteConfig: {
        indicator: {
          color: (color) => indicatorColor(color),
          shadow: (color) => shadowColor(color),
          height: cellSize * 0.2,
          width: cellSize * 0.56,
          topHeight: cellSize * 0.1,
          margin: cellSize * 0.22
        },
        dot: {
          size: cellSize * 0.2,
          position: cellSize * 0.1
        },
        cut: {
          color: (color) => cutColor(color),
          shadow: (color) => shadowColor(color),
          size: cellSize * 0.05
        },
        note: {
          color: (color) => color,
          size: cellSize
        }
      },
      /*
        default value is to protect from overflowing notes
        when they are rotated
      */
      notePadding: (gap || (Math.sqrt(2) - 1.08) * cellSize) / 2
    }),
    [cellSize, gap]
  )

  return (
    <div
      className={classes.grid}
      style={{
        ...style,
        '--note-padding': notePadding,
        '--note-border-size': gridBorderSize,
        '--note-border-color': gridColor
      }}
    >
      {noteCuts.map((rowNotes) =>
        rowNotes.map((cell) => (
          <div className={classes.blockWrapper}>
            <NoteBlock fadeTime={fadeTime} noteConfig={noteConfig} cut={cell} />
          </div>
        ))
      )}
    </div>
  )
}
