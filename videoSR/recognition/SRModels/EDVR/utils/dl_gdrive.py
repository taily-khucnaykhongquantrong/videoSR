from __future__ import print_function
import requests
import sys, os

def sizeof_fmt(num, suffix='B'):
    for unit in ['','K','M','G','T','P','E','Z']:
        if abs(num) < 1024.0:
            return "%3.1f%s%s" % (num, unit, suffix)
        num /= 1024.0
    return "%.1f%s%s" % (num, 'Yi', suffix)

class GdriveDownload():
    def __init__(self, gdrive_url, output_path):
        self.gdrive_url = gdrive_url
        self.output_path = output_path

    def download(self):
        file_id = self.getIdFrom(self.gdrive_url)

        if len(file_id) < 20:
            print("File ID '%s' is too short. File id often has more than 30 characters." % file_id)
            return

        print("Start downloading... %s --> %s" % (file_id, self.output_path))
        try:
            self.download_file_from_google_drive(file_id, self.output_path)
        except Exception as e:
            print(e)

    def getIdFrom(self, url):
        # https://drive.google.com/open?id=1FiVbKOXgRtns6IjlzhZtF2LgotEDVpcp
        PREFIX_1 = "https://drive.google.com/open?id="
        #https://drive.google.com/file/d/1FiVbKOXgRtns6IjlzhZtF2LgotEDVpcp/view
        #https://drive.google.com/file/d/1rg2JeGUyQKLIiuG1r8LjL32COCFeEwL6/view?usp=sharing
        PREFIX_2 = "https://drive.google.com/file/d/"
        if url.startswith(PREFIX_1):
            return url.replace(PREFIX_1, "")
        elif url.startswith(PREFIX_2):
            trim_url = url.replace(PREFIX_2, "")
            return trim_url.split('/')[0]
        else:            
            return url

    def download_file_from_google_drive(self, id, destination):
        URL = "https://docs.google.com/uc?export=download"
        session = requests.Session()
        response = session.get(URL, params = { 'id' : id }, stream = True)
        token = self.get_confirm_token(response)

        if token:
            params = { 'id' : id, 'confirm' : token }
            response = session.get(URL, params = params, stream = True)
        self.save_response_content(response, destination)    

    def get_confirm_token(self, response):
        for key, value in response.cookies.items():
            if key.startswith('download_warning'):
                return value
        return None

    def save_response_content(self, response, destination):
        CHUNK_SIZE = 32768
        with open(destination, "wb") as f:
            count = 0
            for chunk in response.iter_content(CHUNK_SIZE):
                if chunk: # filter out keep-alive new chunks
                    f.write(chunk)
                    count += 1
                    if count % 30 == 29:
                        print("Downloading {}: {:<15}".format(destination, sizeof_fmt(num=os.path.getsize(destination))), end='\r')
                        #sys.stdout.flush()


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Number of input params is not correct. Sample command: $ python %s <gdrive_url> output.zip" % os.path.basename(__file__))
    else:
        params = sys.argv[1:]
        
        output_path = params[0] if params[0].count('.') == 1 else params[1]
        gdrive_url = params[1] if output_path == params[0] else params[0]

        gdrive_dl = GdriveDownload(gdrive_url.strip(), output_path.strip())
        gdrive_dl.download()
