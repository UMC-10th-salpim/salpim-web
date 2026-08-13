# Repository workflow instructions

## GitHub upload default

When the user asks to "깃허브에 올려줘", "GitHub에 반영해줘", or otherwise requests uploading the current changes without limiting the scope, treat the request as authorization for this complete workflow:

1. Inspect the worktree and verify only the intended changes are included.
2. Run the relevant build, lint, and whitespace checks before publishing.
3. Create a new feature/fix branch based on the latest `origin/dev`. Preserve user changes and resolve conflicts without discarding unrelated work.
4. Create a concise conventional commit, then push the branch to `origin`.
5. Open a pull request targeting `dev`. Fill in every applicable section of `.github/pull_request_template.md`, and mark only tests that were actually performed.
6. Confirm the PR is conflict-free and wait for required automated checks. Merge it into `dev` only after checks pass.
7. Open a second pull request from `dev` to `main`, using the same repository PR template. Merge it after required checks pass.
8. Fetch the final remote state, verify the published commit is contained in both `origin/dev` and `origin/main`, and synchronize the local checkout to the latest `main` when safe.
9. Report the commit hash, both PR links, checks performed, and final branch status.

Never push directly to `dev` or `main`, force-push, bypass a failed required check, or discard existing user changes. If there is a merge conflict, failing test/check, authentication problem, or branch-protection blocker that cannot be resolved safely, stop before the unsafe step and report the exact blocker.

An explicit user instruction such as "PR까지만", "머지하지 마", a specific target branch, or a narrower Git operation overrides this default workflow.
