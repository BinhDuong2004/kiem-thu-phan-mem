using System.Threading.Tasks;
using MySqlConnector;

namespace server.Utils
{
  public static class DatabaseUtils
  {
    public static MySqlConnection GetConnection()
    {
      var connection = new MySqlConnection(AppDbContext.connectionString);
      connection.Open();
      return connection;
    }
  }
}