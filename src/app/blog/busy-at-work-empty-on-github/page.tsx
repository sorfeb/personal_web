import type { Metadata } from 'next';
import Image from 'next/image';
import PageLayout from '../../../components/PageLayout/PageLayout';
import { PageLayoutBody, PageLayoutHeader } from '../../../components/PageLayout/PageLayout.parts';
import styles from './Article.module.css';

const SLUG = 'busy-at-work-empty-on-github';
const PATH = `/blog/${SLUG}`;
const ASSETS = `/assets/blog/${SLUG}`;
const TITLE = "Busy at work, empty on GitHub: show your work commits on your contribution graph";
const DESCRIPTION = "You code all day, but your GitHub graph is nearly blank because your work lives somewhere GitHub can't see. A small CLI mirrors your real commits there as timestamps only.";
const PUBLISHED = '2026-11-25';
const MEDIUM_URL =
  'https://medium.com/@soros21febriano/busy-at-work-empty-on-github-show-your-work-commits-on-your-contribution-graph-ccd32fc7581c';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    type: 'article',
    url: PATH,
    title: TITLE,
    description: DESCRIPTION,
    publishedTime: PUBLISHED,
    authors: ['Soros Febriano'],
    images: [{ url: `${ASSETS}/cover.png`, width: 1600, height: 800 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: [`${ASSETS}/cover.png`],
  },
};

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: TITLE,
  description: DESCRIPTION,
  datePublished: PUBLISHED,
  image: `https://www.sorosfebria.co${ASSETS}/cover.png`,
  url: `https://www.sorosfebria.co${PATH}`,
  author: { '@type': 'Person', name: 'Soros Febriano', url: 'https://www.sorosfebria.co' },
};

/**
 * Greenbridge launch article. Canonical copy: the Medium, dev.to, and Hashnode
 * versions set their canonical URL to this page.
 */
export default function BusyAtWorkEmptyOnGitHubPage() {
  return (
    <PageLayout title="Blog" variant="windowed">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <PageLayoutHeader />
      <PageLayoutBody>
        <article className={styles.article}>
          <h1>Busy at work, empty on GitHub: show your work commits on your contribution graph</h1>
          <p className={styles.subtitle}>You code all day, but your GitHub graph is nearly blank because your work lives somewhere GitHub can’t see. I built a small CLI that mirrors your real commits there as timestamps only.</p>
          <p className={styles.meta}>
            Soros Febriano · <time dateTime={PUBLISHED}>November 25, 2026</time> · Also on{' '}
            <a href={MEDIUM_URL}>Medium</a>
          </p>
          <figure className={styles.figure}>
            <Image
              src={`${ASSETS}/cover.png`}
              alt="Before and after: a sparse contribution graph, work commits from GitLab, Bitbucket, Gitea, Forgejo, or Codeberg crossing a pixel bridge, and a busy GitHub graph. greenbridge wordmark below."
              width={1600}
              height={800}
              priority
            />
          </figure>
          <p>You write code all day. You ship every week. And your GitHub contribution graph looks like you stopped programming years ago.</p>
          <p>The reason is simple: your work doesn’t happen on github.com. It lives on your employer’s GitLab or Bitbucket, a self-hosted Gitea or Forgejo, an on-prem git server, or GitHub Enterprise Server. By the evening there’s no time left for side projects, so the graph stays gray. Then a recruiter or hiring manager opens your profile and sees almost nothing.</p>
          <p>GitHub counts a commit only when it sits on the default branch of a non-fork repo that GitHub hosts, and its author email belongs to your account. Work anywhere else never reaches it, no matter how much of it there is.</p>
          <p>I built <a href="https://github.com/sorfeb/greenbridge">greenbridge</a> (command: <code>gbridge</code>) so the work you already do shows up on your GitHub graph, wherever it&apos;s hosted, without uploading code, commit messages, or host tokens. It is a single Go binary under the MIT license. v0.1.0 shipped in November 2026. It is a young project with one maintainer, and it does one job: mirror commits you already wrote onto your GitHub graph.</p>
          <h2>First, check whether you need this</h2>
          <figure className={styles.figure}>
            <Image
              src={`${ASSETS}/need.png`}
              alt="A signpost: code on github.com is already counted; code anywhere else points to gbridge."
              width={1360}
              height={415}
            />
          </figure>
          <p>GitHub already covers two setups. Skip <code>gbridge</code> if either applies:</p>
          <ul>
            <li><strong>Your employer’s code is in an organization on github.com.</strong> GitHub already counts those commits. For private repos, turn on <strong>Include private contributions on my profile</strong> at <code>https://github.com/settings/profile</code>, and make sure your work email is on your GitHub account.</li>
            <li><strong>Your employer runs GitHub Enterprise Server with unified contributions.</strong> An enterprise owner enables it, you link your accounts, and GitHub sends anonymized contribution counts to your github.com graph. Ask your administrator.</li>
          </ul>
          <p>If neither applies, <code>gbridge</code> is for you. The host doesn&apos;t matter: GitLab, Bitbucket Cloud and Server, Gitea, Forgejo, Codeberg, GitHub Enterprise Server without unified contributions, or any server you can <code>git clone</code> from. Whether you want to show GitLab contributions on GitHub or get Bitbucket commits on your GitHub profile, it&apos;s the same few commands.</p>
          <h2>How it works</h2>
          <figure className={styles.figure}>
            <Image
              src={`${ASSETS}/bridge.gif`}
              alt="Commit squares cross a suspension bridge from a private forge to a GitHub contribution graph"
              width={1200}
              height={620}
              unoptimized
            />
          </figure>
          <p>Some tools in this space read your commits through one host’s API (GitLab or Gitea, say), which means one tool per host and a token for each. I did not want a personal tool holding a token for an employer server.</p>
          <p><code>gbridge</code> reads commit metadata from your local git clones instead. It shells out to <code>git</code>, calls no host API, and needs no host token. On the GitHub side it uses the GitHub CLI you are already logged into.</p>
          <p>For each commit you authored (matched by your work email), <code>gbridge</code> writes one empty, backdated commit to a private mirror repo you own on GitHub, <code>greenbridge-activity</code> by default. GitHub counts an empty commit like any other, so a green square appears on the day you did the work.</p>
          <p>A few details that matter in practice:</p>
          <ul>
            <li><strong>Repos that already have a github.com remote are skipped,</strong> since GitHub counts them already.</li>
            <li><strong>Reruns are safe.</strong> There is no state file. Every run reads the IDs of already-mirrored commits back from the mirror repo’s own git log and adds only what is missing.</li>
            <li><strong>History rewrites don’t inflate the graph.</strong> A rebased, cherry-picked, or amended commit keeps its author email and author date, so it maps to the same ID and counts once. I tested all three.</li>
            <li><strong>Past work comes along.</strong> The first sync goes as far back as your clones go.</li>
          </ul>
          <h2>What leaves your machine</h2>
          <figure className={styles.figure}>
            <Image
              src={`${ASSETS}/leaves.png`}
              alt="A sieve: code, diffs, messages, and names stay on top; only a timestamp and an ID fall through to the graph."
              width={1360}
              height={552}
            />
          </figure>
          <p>For every source commit, exactly two things leave your machine:</p>
          <ol>
            <li>A timestamp: exact for a private mirror, date only for a public one.</li>
            <li>An opaque 12-character ID: <code>HMAC(secret, email NUL author_unix_time)</code>, a keyed hash of your email and the commit&apos;s author time.</li>
          </ol>
          <p>Your code, diffs, file names, commit messages, repo and branch names, commit hashes, and work email stay local.</p>
          <p>Because the ID is keyed with a secret that never leaves your machine, nobody can match a mirror commit back to a source commit without it, including people with access to the source repo. Run <code>gbridge secret</code> to print a recovery phrase and back it up. Losing it means the next sync can&apos;t recognize what is already mirrored, and your work double counts. The same phrase sets up a second machine: <code>gbridge init --secret &lt;phrase&gt;</code>.</p>
          <h2>The honesty line</h2>
          <figure className={styles.figure}>
            <Image
              src={`${ASSETS}/honesty.png`}
              alt="A level balance: three commits you wrote on one side, three green squares on the same days on the other."
              width={1360}
              height={431}
            />
          </figure>
          <p><code>gbridge</code> follows one rule: mirror real commits one to one, at the time you wrote them.</p>
          <p>It has no gap filling, no streak padding, and no way to paint patterns. Tools that fabricate activity break GitHub’s <a href="https://docs.github.com/en/site-policy/acceptable-use-policies/github-acceptable-use-policies#4-spam-and-inauthentic-activity-on-github">acceptable use policy on inauthentic activity</a>. <code>gbridge</code> is designed to stay on the right side of it.</p>
          <p>Check your employment contract before you mirror employer work. Only timestamps and opaque IDs leave your machine, but some employers treat even timestamps as internal. <code>gbridge init</code> shows the same notice before it sets anything up.</p>
          <h2>Real numbers from my own graph</h2>
          <p>Here is my own GitHub account, last 12 months to 2026–11–02. <code>gbridge</code> mirrored 2,292 commits from non-GitHub hosts, from 2026-09-09 on.</p>
          <table className={styles.table}>
            <thead>
              <tr><th></th><th>Before</th><th>After gbridge sync</th></tr>
            </thead>
            <tbody>
              <tr><td>Contributions, 12 months</td><td>6,994</td><td>9,268 (+33%)</td></tr>
              <tr><td>Contributions, last 9 weeks</td><td>1,799</td><td>4,073 (2.3x)</td></tr>
              <tr><td>Active days, last 9 weeks</td><td>57 of 63</td><td>63 of 63</td></tr>
              <tr><td>Longest streak</td><td>82 days</td><td>95 days</td></tr>
            </tbody>
          </table>
          <p>Every added square is a commit I wrote, on the day I wrote it.</p>
          <figure className={styles.figure}>
            <Image
              src={`${ASSETS}/proof.png`}
              alt="A contribution graph before and after gbridge sync: sparse personal activity, then a busy weekday pattern with a two-week holiday left empty. Illustrative sample data."
              width={1060}
              height={504}
            />
            <figcaption>Illustration with sample data, not my account.</figcaption>
          </figure>
          <h2>Install</h2>
          <figure className={styles.figure}>
            <Image
              src={`${ASSETS}/install.png`}
              alt="An open box of green squares: install with scoop, brew, mise, or go install."
              width={1360}
              height={461}
            />
          </figure>
          <p>You need <code>git</code> and the <a href="https://cli.github.com">GitHub CLI</a>, logged in with <code>gh auth login</code>. Pick one:</p>
          <pre className={styles.code}>
            <code>{`# Windows, Scoop
scoop bucket add sorfeb https://github.com/sorfeb/scoop-bucket
scoop install sorfeb/gbridge

# mise
mise use -g github:sorfeb/greenbridge

# Go 1.27+
go install github.com/sorfeb/greenbridge/cmd/gbridge@latest`}</code>
          </pre>
          <p>There is also a Homebrew cask, <code>brew install sorfeb/tap/gbridge</code>, which I haven&apos;t verified on a Mac yet. Release archives for Linux, macOS, and Windows (amd64 and arm64) are on the <a href="https://github.com/sorfeb/greenbridge/releases">Releases page</a>. Release binaries aren&apos;t signed yet, so macOS and Windows warn on first run. Each release ships checksums, SBOMs, and a build provenance attestation you can check with <code>gh attestation verify</code>.</p>
          <p>The command is <code>gbridge</code>, not <code>gb</code>: oh-my-zsh and prezto alias <code>gb</code> to <code>git branch</code>.</p>
          <h2>Four commands to get your work on your graph</h2>
          <figure className={styles.figure}>
            <Image
              src={`${ASSETS}/terminal.png`}
              alt="A terminal running init, plan, sync, and doctor, with a contribution graph preview."
              width={1360}
              height={461}
            />
          </figure>
          <pre className={styles.code}>
            <code>{`gbridge init --email you@work.com --scan ~/work   # private mirror repo; ~/work is searched on every run
gbridge plan                                      # preview, writes nothing
gbridge sync                                      # mirror and push; rerun any time
gbridge doctor                                    # explains missing squares`}</code>
          </pre>
          <p><code>--scan</code> names a folder <code>gbridge</code> searches for repos on every run, so a repo you clone next month counts without another setup step.</p>
          <p><code>gbridge plan</code> writes nothing. It prints counts per year and a terminal contribution graph, so you see what will be mirrored before anything reaches GitHub.</p>
          <p>For a private mirror, turn on <strong>Include private contributions on my profile</strong> at <code>https://github.com/settings/profile</code>. No GitHub API exposes that setting, so <code>gbridge doctor</code> reports it as unverified rather than guessing. The graph can take up to 24 hours to update after a push. If squares are still missing, <code>gbridge doctor</code> checks each condition GitHub needs. It also finds commits under your name with an email you didn&apos;t configure, and suggests adding it, unless other authors use that address too.</p>
          <h3>Sync on every push</h3>
          <figure className={styles.figure}>
            <Image
              src={`${ASSETS}/push.png`}
              alt="A git push cart sends squares rolling into a graph: background sync on every push."
              width={1360}
              height={415}
            />
          </figure>
          <pre className={styles.code}>
            <code>{`gbridge hook install`}</code>
          </pre>
          <p>This adds a pre-push hook: every <code>git push</code> from a source repo starts a background sync. It never fails or slows the push, and its output goes to a log file. On Git 2.54 and later it lives in your global git config, so no repo&apos;s files change. On older Git, <code>gbridge hook install --per-repo</code> writes the hook into each source repo&apos;s <code>.git/hooks</code> instead. <code>gbridge hook status</code> and <code>gbridge hook uninstall</code> do what they say.</p>
          <h2>Known limits</h2>
          <figure className={styles.figure}>
            <Image
              src={`${ASSETS}/limits.png`}
              alt="Two rain gauges: the forge heatmap catches comments, PRs, pushes, and commits; gbridge catches commits only."
              width={1360}
              height={567}
            />
          </figure>
          <p>I’d rather you hear these from me:</p>
          <ul>
            <li><strong>Clones only.</strong> Commits that never reached a local clone are invisible. Run <code>git fetch --all</code> before syncing.</li>
            <li><strong>Commits only.</strong> Pull requests, issues, and reviews are not mirrored.</li>
            <li><strong>Removal is manual.</strong> Sync only adds. Removing mirrored commits means rebuilding the mirror and force-pushing it.</li>
            <li><strong>One mirror per config.</strong> Splitting activity per employer isn’t supported yet.</li>
            <li><strong>Same-second commits collapse.</strong> Two commits by one email in the same second count once.</li>
          </ul>
          <p>Other open-source tools solve the same problem with different trade-offs. The README has a <a href="https://github.com/sorfeb/greenbridge#alternatives">comparison table</a>, including where they do better.</p>
          <h2>Try it without writing anything</h2>
          <figure className={styles.figure}>
            <Image
              src={`${ASSETS}/tryit.png`}
              alt="A magnifier over a contribution graph: gbridge plan previews and writes nothing."
              width={1360}
              height={416}
            />
          </figure>
          <p>If your GitHub contribution graph hides your private work commits, run <code>gbridge plan</code> first. It writes nothing and shows what your graph is missing.</p>
          <p>The code, install options, and docs are at <a href="https://github.com/sorfeb/greenbridge">github.com/sorfeb/greenbridge</a>. If it’s useful, star the repo. If something breaks or a host behaves differently, open an issue.</p>
        </article>
      </PageLayoutBody>
    </PageLayout>
  );
}
