import json
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:\Users\Eric\.gemini\antigravity-ide\brain\4efd318b-a573-4c63-9709-18083920362e\.system_generated\logs\transcript.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        data = json.loads(line)
        if data.get('source') == 'MODEL' and 'tool_calls' in data:
            for call in data['tool_calls']:
                args = call['args']
                if isinstance(args, str):
                    try:
                        args = json.loads(args)
                    except:
                        continue
                if 'Home.tsx' in str(args):
                    rc = args.get('ReplacementContent') or args.get('CodeContent') or ''
                    if rc:
                        print(f"Step {data.get('step_index')}:")
                        for l in rc.split('\n'):
                            if 'import' in l and 'assets' in l:
                                print(f"  {l.strip()}")
