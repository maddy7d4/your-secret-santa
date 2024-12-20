let clients = new Set<ReadableStreamDefaultController<string>>();

export function addClient(controller: ReadableStreamDefaultController<string>) {
    clients.add(controller);
}

export function removeClient(controller: ReadableStreamDefaultController<string>) {
    clients.delete(controller);
}

export async function notifyClients(message: string) {
    clients.forEach(client => {
        client.enqueue(`data: ${JSON.stringify(message)}\n\n`);
    });
}

