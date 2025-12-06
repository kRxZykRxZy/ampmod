 
import { APP_NAME } from "@ampmod/branding";
import styles from "./update-notice.css";
import { defineMessages } from "react-intl";
import Modal from '../modal/modal.jsx';
import Box from '../box/box.jsx';
import React from 'react';

const majorMinorVersion =
  process.env.ampmod_version.match(/^\d+\.\d+/)?.[0] ||
  process.env.ampmod_version;

const messages = defineMessages({
  updatedNoticeTitle: {
    defaultMessage: '{APP_NAME} {version} Patch Notes',
    description: 'Title for the modal that shows when AmpMod is updated',
    id: 'amp.updatedNotice.title',
  },
});
/* ampUpdateNotes (a shortcut to this file) */

export default props => <Modal
  className={styles.modalContent}
  contentLabel={props.intl.formatMessage(messages.updatedNoticeTitle, { APP_NAME, version: majorMinorVersion })}
  onRequestClose={props.onCancel}
  id="ampmodUpdated"
>
  <Box className={styles.updateModalContent}>
    <p>AmpMod 0.3 is out now! This update is the largest to date, and possibly, ever.</p>
    <h3>Privacy policy updated</h3>
    <p>
      We updated the privacy policy. Please read the new policy{' '}
      <a href="./privacy.html" target="_blank" rel="noopener noreferrer">here</a>. Remember - we have no interest in
      holding your personal information. ;)
    </p>

    <h3>Let's start off with a PSA about addons</h3>
    <p>
      We are aware that the "Insert blocks by name" addon is currently broken.
      Unfortunately, we did not have time to fix this before release. It will
      be fixed in a later patch version, though!
    </p>
    <p>
      While other addons were also broken during development, we were able to fix them.
    </p>

    <h3>New compiler!</h3>
    <p>
      As you may know, TurboWarp now includes a new compiler to make projects run faster.
    </p>
    <p>
      This compiler has been ported to AmpMod to make projects made in it run
      faster as well. If any errors occur with AmpMod-only functionality,
      report them{' '}
      <a href="https://codeberg.org/ampmod/ampmod/issues" target="_blank" rel="noopener noreferrer">here</a>. For
      functionality from TurboWarp or vanilla Scratch, report the issue{' '}
      <a href="https://scratch.mit.edu/users/GarboMuffin" target="_blank" rel="noopener noreferrer">here</a>.
    </p>
    <p>
      A small number of extensions have been broken by the new compiler. You can access AmpMod 0.2.2, which
      uses the old compiler,{' '}
      <a href="https://ampmod.codeberg.page/@0.2.2-archived/editor">here</a>.
    </p>
    <p>
      <a href="./new-compiler.html" target="_blank" rel="noopener noreferrer">We have a page with more info about the compiler.</a>
    </p>

    <h3>New blocks</h3>
    <p>The following new blocks have been added in AmpMod 0.3:</p>
    <ul>
      <li>new line</li>
      <li>last key pressed</li>
      <li>() mouse button down?</li>
      <li>for each (var) in ()</li>
      <li>switch backdrop to () and wait (this was available for the stage in
          previous versions, and is now available for sprites)</li>
      <li>change by x: () y: ()</li>
      <li>running as a clone?</li>
      <li>when stop sign clicked</li>
      <li>letters () to () of ()</li>
      <li>online?</li>
    </ul>

    <h3>Other new features</h3>
    <p>
      AmpMod 0.3 features a bunch of new features that might make you think
      AmpMod 0.2.2 is incomplete!
    </p>
    <ul>
      <li>
        In the danger zone section of Program Settings (formerly Advanced
        Settings), you can now optionally enable case sensitivity for the ()
        = () block.
      </li>
      <li>
        You can now save custom extensions to your browser! They'll appear in
        the library when you save them.
      </li>
      <li>
        You can now filter items by multiple tags in libraries using the
        sidebar. There is also a single combined "Uncategorised" tag for all
        items that do not have a tag.
      </li>
      <li>
        The Arrays+ extension includes blocks that expand the Arrays category
        with new features! In addition, we have added multiple arrays blocks
        to extensions.
      </li>
      <li>Stage size presets have been added to the Program Settings menu.</li>
      <li>
        The "Editor customisable colours" addon has been added, allowing you
        to change the colours of the editor UI to what you prefer.
      </li>
      <li>The Pen extension has been converted to a core category in the palette.</li>
      <li>
        Operators blocks that handle strings have been moved to a new
        "Strings" category.
      </li>
      <li>You can now rename sprites in the backpack.</li>
    </ul>

    <h3>Bug fixes</h3>
    <ul>
      <li>
        Legacy Lists is now available (it was previously unavailable due to a
        bug; in versions of AmpMod before 0.2.1 the broken version was
        accessible)
      </li>
      <li>Multiple arrays bugs have been fixed.</li>
      <li>
        Removed multiple features that do not work yet. We hope to bring them
        back soon though!
      </li>
      <li>URL parameters no longer cause a 404 error.</li>
    </ul>

    <h3>Performance</h3>
    <ul>
      <li>AmpMod has been updated to use the new TurboWarp compiler.</li>
      <li>Performance of the () ^ () block has been negligibly improved.</li>
      <li>
        AmpMod 0.2.2 used the developer build of React due to us being a bit of a rookie.
        AmpMod 0.3 now uses the production build of React. This makes the page load much
        faster. Maybe there was also an obscure bug where AmpMod kept reloading... :P
      </li>
    </ul>

    <h3>Coming soon: AmpMod in your language!</h3>
    <p>
      AmpMod will soon support languages other than English. We hope to bring this update
      to you in a later version of AmpMod.
    </p>

    <Box className={styles.modalBody}>
      <button className={styles.button} onClick={props.onCancel}>
        Close
      </button>
    </Box>
  </Box>
</Modal>