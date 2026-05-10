use anchor_lang::prelude::*;

use crate::{
    constants::{MAX_PROTOCOL_NAME_LEN, PROTOCOL_PROFILE_SEED},
    error::PraetorError,
    state::ProtocolProfile,
};

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct InitializeProtocolProfileArgs {
    pub protocol_name: String,
    pub review_threshold_lamports: u64,
    pub guardian_challenge_required: bool,
}

#[derive(Accounts)]
#[instruction(args: InitializeProtocolProfileArgs)]
pub struct InitializeProtocolProfile<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + ProtocolProfile::INIT_SPACE,
        seeds = [PROTOCOL_PROFILE_SEED, authority.key().as_ref(), treasury.key().as_ref()],
        bump
    )]
    pub protocol_profile: Account<'info, ProtocolProfile>,
    #[account(mut)]
    pub authority: Signer<'info>,
    /// CHECK: Treasury may be a wallet, PDA, or multisig; Praetor stores the address only.
    pub treasury: UncheckedAccount<'info>,
    /// CHECK: Upgrade authority may be any pubkey; Praetor stores the address only.
    pub upgrade_authority: UncheckedAccount<'info>,
    /// CHECK: Guardian may be a wallet or multisig; Praetor stores the address only.
    pub guardian: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<InitializeProtocolProfile>,
    args: InitializeProtocolProfileArgs,
) -> Result<()> {
    require!(
        args.protocol_name.len() <= MAX_PROTOCOL_NAME_LEN,
        PraetorError::ProtocolNameTooLong
    );

    let profile = &mut ctx.accounts.protocol_profile;
    let clock = Clock::get()?;

    profile.authority = ctx.accounts.authority.key();
    profile.treasury = ctx.accounts.treasury.key();
    profile.guardian = ctx.accounts.guardian.key();
    profile.upgrade_authority = ctx.accounts.upgrade_authority.key();
    profile.review_threshold_lamports = args.review_threshold_lamports;
    profile.guardian_challenge_required = args.guardian_challenge_required;
    profile.is_active = true;
    profile.attestation_count = 0;
    profile.active_challenge_count = 0;
    profile.bump = ctx.bumps.protocol_profile;
    profile.created_at = clock.unix_timestamp;
    profile.updated_at = clock.unix_timestamp;
    profile.protocol_name = args.protocol_name;

    Ok(())
}
