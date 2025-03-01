<template>
  <div>
    <n-card>
      <n-grid cols="3" x-gap="12">
        <n-gi span="1">
          <n-form-item label="Language:">
            <n-select
              v-model:value="language"
              :options="Object.keys(languages).map((label) => ({ label, value: label }))"
            />
          </n-form-item>
        </n-gi>
        <n-gi span="2">
          <n-form-item
            label="Entropy (seed):"
            :feedback="entropyValidation.message"
            :validation-status="entropyValidation.status"
          >
            <n-input-group>
              <n-input v-model:value="entropy" placeholder="Your string..." />
              <n-button @click="refreshEntropy">
                <n-icon size="22">
                  <Refresh />
                </n-icon>
              </n-button>
              <n-button @click="copyEntropy">
                <n-icon size="22">
                  <Copy />
                </n-icon>
              </n-button>
            </n-input-group>
          </n-form-item>
        </n-gi>
      </n-grid>
      <n-form-item
        label="Passphrase (mnemonic):"
        :feedback="mnemonicValidation.message"
        :validation-status="mnemonicValidation.status"
      >
        <n-input-group>
          <n-input
            v-model:value="passphrase"
            style="text-align: center; flex: 1"
            placeholder="Your mnemonic..."
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
          />

          <n-button @click="copyPassphrase">
            <n-icon size="22" :component="Copy" />
          </n-button>
        </n-input-group>
      </n-form-item>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { useCopy } from '@/composable/copy';
import { ref, computed } from 'vue';
import {
  entropyToMnemonic,
  englishWordList,
  chineseSimplifiedWordList,
  chineseTraditionalWordList,
  czechWordList,
  frenchWordList,
  italianWordList,
  japaneseWordList,
  koreanWordList,
  portugueseWordList,
  spanishWordList,
  generateEntropy,
  mnemonicToEntropy,
} from '@it-tools/bip39';
import { Copy, Refresh } from '@vicons/tabler';
import { useValidation } from '@/composable/validation';

const languages = {
  English: englishWordList,
  'Chinese simplified': chineseSimplifiedWordList,
  'Chinese traditional': chineseTraditionalWordList,
  Czech: czechWordList,
  French: frenchWordList,
  Italian: italianWordList,
  Japanese: japaneseWordList,
  Korean: koreanWordList,
  Portuguese: portugueseWordList,
  Spanish: spanishWordList,
};

const entropy = ref(generateEntropy());
const passphraseInput = ref('');

const language = ref<keyof typeof languages>('English');
const passphrase = computed({
  get() {
    try {
      return entropyToMnemonic(entropy.value, languages[language.value]);
    } catch (_) {
      return passphraseInput.value;
    }
  },
  set(value: string) {
    passphraseInput.value = value;

    try {
      entropy.value = mnemonicToEntropy(value, languages[language.value]);
    } catch (_) {
      entropy.value = '';
    }
  },
});

const entropyValidation = useValidation({
  source: entropy,
  rules: [
    {
      validator: (value) => value === '' || (value.length <= 32 && value.length >= 16 && value.length % 4 === 0),
      message: 'Entropy length should be >= 16, <= 32 and be a multiple of 4',
    },
    {
      validator: (value) => /^[a-fA-F0-9]*$/.test(value),
      message: 'Entropy should an hexadecimal number',
    },
  ],
});

const mnemonicValidation = useValidation({
  source: passphrase,
  rules: [
    {
      validator: (value) => {
        try {
          mnemonicToEntropy(value);
          return true;
        } catch (_) {
          return false;
        }
      },
      message: 'Invalid mnemonic',
    },
  ],
});

function refreshEntropy() {
  entropy.value = generateEntropy();
}

const { copy: copyEntropy } = useCopy({ source: entropy, text: 'Entropy copied to the clipboard' });
const { copy: copyPassphrase } = useCopy({ source: passphrase, text: 'Passphrase copied to the clipboard' });
</script>
