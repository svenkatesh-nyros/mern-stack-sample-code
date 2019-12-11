export const GET_NOTY = 'GET_NOTY';

export function getNoty(mode,message) {
  return {
    type: GET_NOTY,
    mode,
    message
  }
}