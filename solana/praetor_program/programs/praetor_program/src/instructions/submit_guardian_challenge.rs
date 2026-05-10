use anchor_lang::prelude::*;

use crate::{
    constants::{GUARDIAN_CHALLENGE_SEED, MAX_REASON_LEN},
    error::PraetorError,
    state::{
        AttestationRecord, AttestationStatus, ChallengeStatus, GuardianChallengeRecord,
        ProtocolProfile,
    },
};

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct SubmitGuardianChallengeArgs {
    pub reason: String,
}

#[derive(Accounts)]
#[instruction(args: SubmitGuardianChallengeArgs)]
pub struct SubmitGuardianChallenge<'info> {
    #[account(mut)]
    pub guardian: Signer<'info>,
    #[account(
        mut,
        has_one = guardian
    )]
    pub protocol_profile: Account<'info, ProtocolProfile>,
    #[account(
        mut,
        has_one = protocol_profile
    )]
    pub attestation: Account<'info, AttestationRecord>,
    #[account(
        init,
        payer = guardian,
        space = 8 + GuardianChallengeRecord::INIT_SPACE,
        seeds = [GUARDIAN_CHALLENGE_SEED, attestation.key().as_ref(), guardian.key().as_ref()],
        bump
    )]
    pub guardian_challenge: Account<'info, GuardianChallengeRecord>,
    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<SubmitGuardianChallenge>,
    args: SubmitGuardianChallengeArgs,
) -> Result<()> {
    require!(
        args.reason.len() <= MAX_REASON_LEN,
        PraetorError::ChallengeReasonTooLong
    );
    require!(
        ctx.accounts.attestation.guardian_challenge_required,
        PraetorError::GuardianChallengeNotRequired
    );
    require!(
        !ctx.accounts.attestation.challenge_open,
        PraetorError::ChallengeAlreadyOpen
    );

    let clock = Clock::get()?;
    let challenge = &mut ctx.accounts.guardian_challenge;

    challenge.protocol_profile = ctx.accounts.protocol_profile.key();
    challenge.attestation = ctx.accounts.attestation.key();
    challenge.guardian = ctx.accounts.guardian.key();
    challenge.status = ChallengeStatus::Open;
    challenge.bump = ctx.bumps.guardian_challenge;
    challenge.created_at = clock.unix_timestamp;
    challenge.reason = args.reason;

    let attestation = &mut ctx.accounts.attestation;
    attestation.challenge_open = true;
    attestation.status = AttestationStatus::Blocked;
    attestation.updated_at = clock.unix_timestamp;

    let profile = &mut ctx.accounts.protocol_profile;
    profile.active_challenge_count = profile.active_challenge_count.saturating_add(1);
    profile.updated_at = clock.unix_timestamp;

    Ok(())
}
