import React, { useState } from 'react';
import { getBezierPath, getEdgeCenter } from 'react-flow-renderer';
import { IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
  source,
  target
}) {

  const { onEdgeRemove } = data || {};

  const [isEditing, setIsEditing] = useState(false);

  const edgePath = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const [edgeCenterX, edgeCenterY] = getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <path
        id={id}
        style={{
          ...style,
          cursor: 'pointer',
          strokeWidth: 2,
        }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
        onClick={() => setIsEditing(true)}
      />
      {isEditing && (
        <g transform={`translate(${edgeCenterX - 15}, ${edgeCenterY - 15})`}>
          <foreignObject width={30} height={30}>
            <Tooltip title="Remove edge">
              <IconButton
                size="small"
                color="error"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdgeRemove({ id, source, target });
                }}
                style={{ backgroundColor: 'white' }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </foreignObject>
        </g>
      )}
    </>
  );
}
