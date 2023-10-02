const timeout = (ms: number) => {
    return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export { timeout }