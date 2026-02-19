/**
 * Model representing a single bibliography/citation entry
 */
export interface Bibliography {
    style: string;
    value: string;
}

/**
 * Response from the bibliography HAL endpoint
 */
export interface BibliographyResponse {
    bibliographies: Bibliography[];
}
