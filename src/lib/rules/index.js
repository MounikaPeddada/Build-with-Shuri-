// src/lib/rules/index.js
import { buildNets } from '../nets';
import { checkPhysics } from './physics';
import { checkLikelyMistakes } from './likelyMistake';

const LEVEL_ORDER = { error: 0, warn: 1, info: 2, ok: 3 };

export function evaluateRules(nodes, edges) {
  if (edges.length === 0) {
    return [{
      id: 'empty',
      level: 'info',
      title: 'Start wiring',
      body: 'Drag from one pin to another to draw a wire.',
    }];
  }

  const nets = buildNets(edges);
  
  const results = [
    ...checkPhysics(nets, nodes),
    ...checkLikelyMistakes(nets, nodes, edges) // <-- Pass edges here
  ];

  if (results.length === 0) {
    results.push({
      id: 'ok',
      level: 'ok',
      title: 'No problems found',
      body: 'Every check passed. Real simulation arrives in a later step.',
    });
  }

  return results.sort((a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level]);
}