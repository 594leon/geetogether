export default class Config {
    private static _UPLOADS_DIR: string;
    private static _RABBIT_HOST: string;
    private static _RABBIT_PORT: number;
    private static _RABBIT_QUEUE: string;
    private static _RABBIT_USERNAME: string;
    private static _RABBIT_PASSWORD: string;
    private static _JWT_KEY: string;
    private static _RABBIT_SECRET: string;
    private static _K8S_NAMESPACE: string;

    public static get UPLOADS_DIR(): string {
        return Config._UPLOADS_DIR;
    }
    public static set UPLOADS_DIR(value: string) {
        Config._UPLOADS_DIR = value;
    }

    public static get RABBIT_HOST(): string {
        return Config._RABBIT_HOST;
    }
    public static set RABBIT_HOST(value: string) {
        Config._RABBIT_HOST = value;
    }

    public static get RABBIT_PORT(): number {
        return Config._RABBIT_PORT;
    }
    public static set RABBIT_PORT(value: number) {
        Config._RABBIT_PORT = value;
    }

    public static get RABBIT_QUEUE(): string {
        return Config._RABBIT_QUEUE;
    }
    public static set RABBIT_QUEUE(value: string) {
        Config._RABBIT_QUEUE = value;
    }

    public static get RABBIT_USERNAME(): string {
        return Config._RABBIT_USERNAME;
    }
    public static set RABBIT_USERNAME(value: string) {
        Config._RABBIT_USERNAME = value;
    }

    public static get RABBIT_PASSWORD(): string {
        return Config._RABBIT_PASSWORD;
    }
    public static set RABBIT_PASSWORD(value: string) {
        Config._RABBIT_PASSWORD = value;
    }

    public static get JWT_KEY(): string {
        return Config._JWT_KEY;
    }
    public static set JWT_KEY(value: string) {
        Config._JWT_KEY = value;
    }

    public static get RABBIT_SECRET(): string {
        return Config._RABBIT_SECRET;
    }
    public static set RABBIT_SECRET(value: string) {
        Config._RABBIT_SECRET = value;
    }

    public static get K8S_NAMESPACE(): string {
        return Config._K8S_NAMESPACE;
    }
    public static set K8S_NAMESPACE(value: string) {
        Config._K8S_NAMESPACE = value;
    }
}