from pathlib import Path
import shutil
r=Path(__file__).resolve().parents[1]
shutil.copy2(r/'results/benchmark.png',r/'docs/benchmark.png')
(r/'docs/.nojekyll').touch()
