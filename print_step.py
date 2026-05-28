import json
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:\Users\Eric\.gemini\antigravity-ide\brain\4efd318b-a573-4c63-9709-18083920362e\.system_generated\logs\transcript.jsonl', 'r', encoding='utf-8') as f:
    lines = list(f)
    step_45_data = json.loads(lines[44])
    for call in step_45_data['tool_calls']:
        args = call['args']
        if isinstance(args, str):
            args = json.loads(args)
        rc = args.get('ReplacementContent') or args.get('CodeContent') or ''
        print('\n'.join(rc.split('\n')[50:100]))
