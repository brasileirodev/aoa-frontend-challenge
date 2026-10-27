export type PokemonApiErrorCode =
  | "NOT_FOUND"
  | "NETWORK_ERROR"
  | "HTTP_ERROR"
  | "INVALID_RESPONSE"
  | "INVALID_INPUT";

export class PokemonApiError extends Error {
  readonly code: PokemonApiErrorCode;
  readonly status?: number;

  constructor(code: PokemonApiErrorCode, message: string, status?: number) {
    super(message);
    this.name = "PokemonApiError";
    this.code = code;
    this.status = status;
  }
}
