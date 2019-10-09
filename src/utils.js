export function handleErrors(response) {
    if (response.error) throw new Error(response.error);
    return response;
}