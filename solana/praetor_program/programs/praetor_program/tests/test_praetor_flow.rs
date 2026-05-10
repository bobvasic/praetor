use {
    anchor_lang::{
        prelude::Pubkey,
        solana_program::{instruction::Instruction, system_program},
        InstructionData, ToAccountMetas,
    },
    litesvm::LiteSVM,
    solana_keypair::Keypair,
    solana_message::{Message, VersionedMessage},
    solana_signer::Signer,
    solana_transaction::versioned::VersionedTransaction,
};

fn send_instruction(svm: &mut LiteSVM, payer: &Keypair, instruction: Instruction) {
    let blockhash = svm.latest_blockhash();
    let message = Message::new_with_blockhash(&[instruction], Some(&payer.pubkey()), &blockhash);
    let tx = VersionedTransaction::try_new(VersionedMessage::Legacy(message), &[payer]).unwrap();
    let result = svm.send_transaction(tx);
    assert!(result.is_ok(), "{result:?}");
}

#[test]
fn test_detect_attest_and_block_flow() {
    let program_id = praetor_program::id();
    let authority = Keypair::new();
    let treasury = Keypair::new();
    let upgrade_authority = Keypair::new();
    let suspicious_signer = Keypair::new();
    let destination = Keypair::new();

    let mut svm = LiteSVM::new();
    let bytes = include_bytes!("../../../target/deploy/praetor_program.so");
    svm.add_program(program_id, bytes).unwrap();

    for pubkey in [
        authority.pubkey(),
        treasury.pubkey(),
        upgrade_authority.pubkey(),
        suspicious_signer.pubkey(),
        destination.pubkey(),
    ] {
        svm.airdrop(&pubkey, 1_000_000_000).unwrap();
    }

    let (protocol_profile, _) = Pubkey::find_program_address(
        &[
            praetor_program::PROTOCOL_PROFILE_SEED,
            authority.pubkey().as_ref(),
            treasury.pubkey().as_ref(),
        ],
        &program_id,
    );

    send_instruction(
        &mut svm,
        &authority,
        Instruction::new_with_bytes(
            program_id,
            &praetor_program::instruction::InitializeProtocolProfile {
                args: praetor_program::InitializeProtocolProfileArgs {
                    protocol_name: "DemoDAO Treasury".to_string(),
                    review_threshold_lamports: 10_000_000_000,
                    guardian_challenge_required: true,
                },
            }
            .data(),
            praetor_program::accounts::InitializeProtocolProfile {
                protocol_profile,
                authority: authority.pubkey(),
                treasury: treasury.pubkey(),
                upgrade_authority: upgrade_authority.pubkey(),
                guardian: authority.pubkey(),
                system_program: system_program::ID,
            }
            .to_account_metas(None),
        ),
    );

    let sequence = 0_u64.to_le_bytes();
    let (attestation, _) = Pubkey::find_program_address(
        &[
            praetor_program::ATTESTATION_SEED,
            protocol_profile.as_ref(),
            sequence.as_ref(),
        ],
        &program_id,
    );

    send_instruction(
        &mut svm,
        &authority,
        Instruction::new_with_bytes(
            program_id,
            &praetor_program::instruction::RecordAttestation {
                args: praetor_program::RecordAttestationArgs {
                    incident_id: "inc_demo_001".to_string(),
                    action_type: praetor_program::ActionType::TreasuryWithdrawal,
                    risk_score: 91,
                    risk_level: praetor_program::RiskLevel::Critical,
                    signer: suspicious_signer.pubkey(),
                    destination: destination.pubkey(),
                    amount_lamports: 25_000_000_000,
                    guardian_challenge_required: true,
                },
            }
            .data(),
            praetor_program::accounts::RecordAttestation {
                authority: authority.pubkey(),
                protocol_profile,
                attestation,
                system_program: system_program::ID,
            }
            .to_account_metas(None),
        ),
    );

    let (guardian_challenge, _) = Pubkey::find_program_address(
        &[
            praetor_program::GUARDIAN_CHALLENGE_SEED,
            attestation.as_ref(),
            authority.pubkey().as_ref(),
        ],
        &program_id,
    );

    send_instruction(
        &mut svm,
        &authority,
        Instruction::new_with_bytes(
            program_id,
            &praetor_program::instruction::SubmitGuardianChallenge {
                args: praetor_program::SubmitGuardianChallengeArgs {
                    reason: "Unknown signer attempted treasury withdrawal above policy threshold"
                        .to_string(),
                },
            }
            .data(),
            praetor_program::accounts::SubmitGuardianChallenge {
                guardian: authority.pubkey(),
                protocol_profile,
                attestation,
                guardian_challenge,
                system_program: system_program::ID,
            }
            .to_account_metas(None),
        ),
    );
}
