const subscribers = new Map<string, Set<ReadableStreamDefaultController>>();

export function getSubscribers() {
  return subscribers;
}

export function sendEventToUser(userId: string, event: string, data: unknown) {
  const controllers = subscribers.get(String(userId));
  if (!controllers || controllers.size === 0) return;

  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  const dead: ReadableStreamDefaultController[] = [];

  for (const ctrl of controllers) {
    try {
      ctrl.enqueue(new TextEncoder().encode(payload));
    } catch {
      dead.push(ctrl);
    }
  }

  for (const ctrl of dead) {
    controllers.delete(ctrl);
  }
}

export function sendEventToSchool(schoolId: string, event: string, data: unknown) {
  for (const [, controllers] of subscribers) {
    for (const ctrl of controllers) {
      try {
        const payload = `event: ${event}\ndata: ${JSON.stringify({ ...data as object, school_id: schoolId })}\n\n`;
        ctrl.enqueue(new TextEncoder().encode(payload));
      } catch {}
    }
  }
}
