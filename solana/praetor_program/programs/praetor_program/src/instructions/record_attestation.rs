use anchor_lang::prelude::*;

use crate::{
    constants::{ATTESTATION_SEED, MAX_INCIDENT_ID_LEN},
    error::PraetorError,
    state::{ActionType, AttestationRecord, AttestationStatus, ProtocolProfile, RiskLevel},
};

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct RecordAttestationArgs {
    pub incident_id: String,
    pub action_type: ActionType,
    pub risk_score: u8,
    pub risk_level: RiskLevel,
    pub signer: Pubkey,
    pub destination: Pubkey,
    pub amount_lamports: u64,
    pub guardian_challenge_required: bool,
}

#[derive(Accounts)]
#[instruction(args: RecordAttestationArgs)]
pub struct RecordAttestation<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        mut,
        has_one = authority
    )]
    pub protocol_profile: Account<'info, ProtocolProfile>,
    #[account(
        init,
        payer = authority,
        space = 8 + AttestationRecord::INIT_SPACE,
        seeds = [
            ATTESTATION_SEED,
            protocol_profile.key().as_ref(),
            protocol_profile.attestation_count.to_le_bytes().as_ref()
        ],
        bump
    )]
    pub attestation: Account<'info, AttestationRecord>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<RecordAttestation>, args: RecordAttestationArgs) -> Result<()> {
    let profile = &mut ctx.accounts.protocol_profile;

    require!(profile.is_active, PraetorError::ProtocolInactive);
    require!(args.risk_score <= 100, PraetorError::InvalidRiskScore);
    require!(
        args.incident_id.len() <= MAX_INCIDENT_ID_LEN,
        PraetorError::IncidentIdTooLong
    );

    let clock = Clock::get()?;
    let sequence = profile.attestation_count;
    let attestation = &mut ctx.accounts.attestation;

    attestation.protocol_profile = profile.key();
    attestation.authority = ctx.accounts.authority.key();
    attestation.signer = args.signer;
    attestation.destination = args.destination;
    attestation.sequence = sequence;
    attestation.amount_lamports = args.amount_lamports;
    attestation.risk_score = args.risk_score;
    attestation.risk_level = args.risk_level;
    attestation.action_type = args.action_type;
    attestation.status = AttestationStatus::Attested;
    attestation.guardian_challenge_required =
        args.guardian_challenge_required || profile.guardian_challenge_required;
    attestation.challenge_open = false;
    attestation.bump = ctx.bumps.attestation;
    attestation.created_at = clock.unix_timestamp;
    attestation.updated_at = clock.unix_timestamp;
    attestation.incident_id = args.incident_id;

    profile.attestation_count = sequence.saturating_add(1);
    profile.updated_at = clock.unix_timestamp;

    Ok(())
}
