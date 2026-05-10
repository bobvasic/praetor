#![allow(ambiguous_glob_reexports)]
pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("HKQ5WMoZFuT2zrDJyoKKpQFLQgtVMsuHUhuAM1DcqLbk");

#[program]
pub mod praetor_program {
    use super::*;
    pub fn initialize_protocol_profile(
        ctx: Context<InitializeProtocolProfile>,
        args: InitializeProtocolProfileArgs,
    ) -> Result<()> {
        initialize_protocol_profile::handler(ctx, args)
    }

    pub fn record_attestation(
        ctx: Context<RecordAttestation>,
        args: RecordAttestationArgs,
    ) -> Result<()> {
        record_attestation::handler(ctx, args)
    }

    pub fn submit_guardian_challenge(
        ctx: Context<SubmitGuardianChallenge>,
        args: SubmitGuardianChallengeArgs,
    ) -> Result<()> {
        submit_guardian_challenge::handler(ctx, args)
    }
}
