use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, InitSpace, Clone, Copy, PartialEq, Eq, Debug)]
pub enum ActionType {
    TreasuryWithdrawal,
    UpgradeAuthorityUse,
    SignerSetChange,
}

#[derive(AnchorSerialize, AnchorDeserialize, InitSpace, Clone, Copy, PartialEq, Eq, Debug)]
pub enum RiskLevel {
    Low,
    Medium,
    High,
    Critical,
}

#[derive(AnchorSerialize, AnchorDeserialize, InitSpace, Clone, Copy, PartialEq, Eq, Debug)]
pub enum AttestationStatus {
    Attested,
    Blocked,
}

#[derive(AnchorSerialize, AnchorDeserialize, InitSpace, Clone, Copy, PartialEq, Eq, Debug)]
pub enum ChallengeStatus {
    Open,
}

#[account]
#[derive(InitSpace)]
pub struct ProtocolProfile {
    pub authority: Pubkey,
    pub treasury: Pubkey,
    pub guardian: Pubkey,
    pub upgrade_authority: Pubkey,
    pub review_threshold_lamports: u64,
    pub guardian_challenge_required: bool,
    pub is_active: bool,
    pub attestation_count: u64,
    pub active_challenge_count: u64,
    pub bump: u8,
    pub created_at: i64,
    pub updated_at: i64,
    #[max_len(48)]
    pub protocol_name: String,
}

#[account]
#[derive(InitSpace)]
pub struct AttestationRecord {
    pub protocol_profile: Pubkey,
    pub authority: Pubkey,
    pub signer: Pubkey,
    pub destination: Pubkey,
    pub sequence: u64,
    pub amount_lamports: u64,
    pub risk_score: u8,
    pub risk_level: RiskLevel,
    pub action_type: ActionType,
    pub status: AttestationStatus,
    pub guardian_challenge_required: bool,
    pub challenge_open: bool,
    pub bump: u8,
    pub created_at: i64,
    pub updated_at: i64,
    #[max_len(64)]
    pub incident_id: String,
}

#[account]
#[derive(InitSpace)]
pub struct GuardianChallengeRecord {
    pub protocol_profile: Pubkey,
    pub attestation: Pubkey,
    pub guardian: Pubkey,
    pub status: ChallengeStatus,
    pub bump: u8,
    pub created_at: i64,
    #[max_len(160)]
    pub reason: String,
}
