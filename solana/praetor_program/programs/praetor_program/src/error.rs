use anchor_lang::prelude::*;

#[error_code]
pub enum PraetorError {
    #[msg("Protocol name is too long for the allocated account space")]
    ProtocolNameTooLong,
    #[msg("Incident id is too long for the allocated account space")]
    IncidentIdTooLong,
    #[msg("Guardian challenge reason is too long for the allocated account space")]
    ChallengeReasonTooLong,
    #[msg("Risk score must be between 0 and 100")]
    InvalidRiskScore,
    #[msg("Protocol profile is not active")]
    ProtocolInactive,
    #[msg("Guardian challenge is not required for this attestation")]
    GuardianChallengeNotRequired,
    #[msg("A guardian challenge is already open for this attestation")]
    ChallengeAlreadyOpen,
}
