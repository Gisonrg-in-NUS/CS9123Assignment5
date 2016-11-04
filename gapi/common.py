import os

BASE_PATH = 'var'
CLONE_PATH = os.path.join(BASE_PATH, 'repo')
FLAG_PATH = os.path.join(BASE_PATH, 'flag')
LOCK_PATH = os.path.join(BASE_PATH, 'lock')
BLAME_PATH = os.path.join(BASE_PATH, 'blame')


def make_dir_if_needed(filename):
    directory = os.path.dirname(filename)
    if not os.path.exists(directory):
        os.makedirs(directory)
    return filename


def _get_path(base):
    return lambda repo: make_dir_if_needed(os.path.join(base, repo))


get_clone_path, get_flag_path, get_lock_path, get_blame_path = (_get_path(i) for i in
                                                                (CLONE_PATH, FLAG_PATH, LOCK_PATH, BLAME_PATH))
